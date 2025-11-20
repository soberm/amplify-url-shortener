import { defineBackend } from '@aws-amplify/backend';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { urlShortener } from './functions/url-shortener/resource';
import { redirect } from './functions/redirect/resource';

const backend = defineBackend({
  auth,
  data,
  urlShortener,
  redirect
});

// Create REST API Gateway
const apiStack = backend.createStack('api-stack');

const api = new apigateway.RestApi(apiStack, 'RestApi', {
  restApiName: 'URL Shortener API',
  defaultCorsPreflightOptions: {
    allowOrigins: apigateway.Cors.ALL_ORIGINS,
    allowMethods: apigateway.Cors.ALL_METHODS,
    allowHeaders: ['Content-Type', 'Authorization']
  }
});

const authorizer = new apigateway.CognitoUserPoolsAuthorizer(apiStack, 'Authorizer', {
  cognitoUserPools: [backend.auth.resources.userPool]
});

// Authenticated endpoint for creating short URLs
const shortenResource = api.root.addResource('shorten');
shortenResource.addMethod('POST', 
  new apigateway.LambdaIntegration(backend.urlShortener.resources.lambda), {
    authorizer,
    authorizationType: apigateway.AuthorizationType.COGNITO
  }
);

// Public endpoint for redirecting short URLs (no auth required)
const shortCodeResource = api.root.addResource('{shortCode}');
shortCodeResource.addMethod('GET', 
  new apigateway.LambdaIntegration(backend.redirect.resources.lambda),
  {
    authorizationType: apigateway.AuthorizationType.NONE
  }
);

// Grant DynamoDB access to redirect function
backend.redirect.addEnvironment('URL_TABLE_NAME', backend.data.resources.tables['Url'].tableName);
backend.data.resources.tables['Url'].grantReadData(backend.redirect.resources.lambda);

backend.addOutput({
  custom: {
    API: {
      [api.restApiName || 'RestApi']: {
        endpoint: api.url,
        region: apiStack.region,
        apiName: api.restApiName
      }
    }
  }
});

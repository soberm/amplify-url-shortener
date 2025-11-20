import type { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  const shortCode = event.pathParameters?.shortCode;
  
  if (!shortCode) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Short code is required' })
    };
  }

  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.URL_TABLE_NAME,
      FilterExpression: 'shortCode = :shortCode',
      ExpressionAttributeValues: {
        ':shortCode': shortCode
      }
    }));

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Short URL not found' })
      };
    }

    const url = result.Items[0];
    return {
      statusCode: 302,
      headers: {
        Location: url.originalUrl
      },
      body: ''
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

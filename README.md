# URL Shortener Service

A minimal URL shortener built with AWS Amplify Gen2, featuring:
- Cognito authentication
- GraphQL API with DynamoDB storage
- REST API for URL shortening
- React frontend

## Quick Start

1. **Deploy Backend**:
   ```bash
   npx ampx sandbox
   ```

2. **Start Frontend**:
   ```bash
   npm start
   ```

## Features

- **Authentication**: Email/password signup and signin
- **URL Management**: Create and view shortened URLs
- **Secure**: User-owned data with Cognito authorization
- **REST API**: `/shorten` endpoint for programmatic access

## API Usage

POST to `/shorten` with Authorization header:
```json
{
  "originalUrl": "https://example.com"
}
```

Returns:
```json
{
  "shortCode": "abc123",
  "originalUrl": "https://example.com"
}
```

## Architecture

- **Auth**: AWS Cognito User Pools
- **Data**: GraphQL API + DynamoDB
- **Functions**: Lambda for URL shortening logic
- **API**: REST API Gateway with Cognito authorization
- **Frontend**: React with Amplify client libraries

import type { APIGatewayProxyHandler } from 'aws-lambda';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const { originalUrl } = JSON.parse(event.body || '{}');
  
  if (!originalUrl) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'originalUrl is required' })
    };
  }

  const shortCode = Math.random().toString(36).substring(2, 8);
  
  return {
    statusCode: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ shortCode, originalUrl })
  };
};

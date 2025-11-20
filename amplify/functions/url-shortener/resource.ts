import { defineFunction } from '@aws-amplify/backend';

export const urlShortener = defineFunction({
  name: 'url-shortener',
  entry: './handler.ts'
});

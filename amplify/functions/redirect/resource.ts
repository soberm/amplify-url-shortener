import { defineFunction } from '@aws-amplify/backend';

export const redirect = defineFunction({
  name: 'redirect',
  entry: './handler.ts'
});

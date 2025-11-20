export const createUrl = `
  mutation CreateUrl($input: CreateUrlInput!) {
    createUrl(input: $input) {
      id
      shortCode
      originalUrl
      createdAt
      owner
    }
  }
`;

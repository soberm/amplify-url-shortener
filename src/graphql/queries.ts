export const listUrls = `
  query ListUrls {
    listUrls {
      items {
        id
        shortCode
        originalUrl
        createdAt
        owner
      }
    }
  }
`;

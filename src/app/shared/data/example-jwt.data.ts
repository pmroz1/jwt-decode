export const exampleEncodedJwt = `
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
`;

export const exampleDecodedJwt = {
  header: {
    alg: 'HS256',
    typ: 'JWT',
  },
  payload: {
    sub: '1234567890',
    name: 'John Doe',
    admin: true,
    iat: 1516239022,
  },
  signature: 'KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
};

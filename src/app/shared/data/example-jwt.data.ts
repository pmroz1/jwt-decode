export const jwtTestCases = [
  {
    description: "Basic HS256 token",
    encoded: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjIwMDAwMDAwfQ.8NG16hNRhSUgCrUZyBgFjRY3s0NDQd8--tTEPEVqLL8",
    decoded: {
      header: { alg: "HS256", typ: "JWT" },
      payload: { sub: "user1", role: "user", iat: 1620000000 }
    },
    key: "secret-key-123"
  },
  {
    description: "Nested object payload with HS256",
    encoded: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0MiwiZGVzYyI6IkFsaWNlIn0sInBlcm1pc3Npb25zIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE5MjAwMDAwMDB9.4QdNOiT5DDB5lk-HTxQ_s061kPrX4KKT8prw0bizA9Y",
    decoded: {
      header: { alg: "HS256", typ: "JWT" },
      payload: { user: { id: 42, desc: "Alice" }, permissions: ["read", "write"], exp: 1920000000 }
    },
    key: "another-secret"
  },
  {
    description: "Unicode payload HS256",
    encoded: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbW9qaSI6IlXigJoiLCJpYXQiOjE2MDk0NTkyMDAsIm1lc3NhZ2UiOiLlvqrli4_jgILniY0ifQ.L8lErU_ZJwn9EKEq1tW0X6VU79Le5OgQxxh3XnXhZgs",
    decoded: {
      header: { alg: "HS256", typ: "JWT" },
      payload: { message: "こんにちは世界", emoji: "🚀", iat: 1609459200 }
    },
    key: "unicode-key"
  },
  {
    description: "Large string payload HS512",
    encoded: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiQUFBQUFBQUF... (500× \"A\") ...,IiIn0.yF_2cIjR1KwxTO-ZuFBgtn8APGDyL_j5U6QfQ0nyEci6HBfkz1MtZ8pryV9hoNuO2rJc1I-tpQiiXgBCVYV0Og",
    decoded: {
      header: { alg: "HS512", typ: "JWT" },
      payload: { data: "A".repeat(500), timestamp: 1625097600 }
    },
    key: "strong-secret-key-512"
  },
  {
    description: "Array in payload HS384",
    encoded: "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJpdGVtcyI6WzEsMiwzLHsibmVzdGVkIjpbImEiLCJiIiwiYyJdfV0sInRhZyI6InRlc3QifQ.N8X4bUAQ_VxLqhxYDdrFhGcHMUb65cQThT4_wFvDjWGhRyiZb5kEvIlfGJpfmL9r",
    decoded: {
      header: { alg: "HS384", typ: "JWT" },
      payload: { items: [1, 2, 3, { nested: ["a", "b", "c"] }], tag: "test" }
    },
    key: "array-key-384"
  }
];

export const exampleEncodedJwt = jwtTestCases[0].encoded;
export const exampleSigningKey = jwtTestCases[0].key;

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

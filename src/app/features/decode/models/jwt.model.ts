export interface JwtDecoded {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
  raw: string;
  signingKey: string;
}

export interface JwtHeader {
  alg: string;
  typ: string;
}

export interface JwtPayload {
  sub: string;
  name: string;
  iat: number;
  exp: number;
  aud?: string | string[];
  iss?: string;
}

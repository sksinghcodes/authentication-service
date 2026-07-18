export interface JwtTokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export interface CreateTokenInput {
  userId: string;
  secret: string;
  expiresInSeconds: number;
}

export interface TokenInfo {
  value: string;
  issuedAt: Date;
  expiresAt: Date;
}

export interface RefreshTokenCreateRepoInput {
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  device_info: string | null;
  user_agent: string | null;
  ip_address: string | null;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenFindRepoOutput {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  revoked_at: Date | null;
  device_info: string | null;
  user_agent: string | null;
  ip_address: string | null;
}

export interface RefreshTokenStoreServiceInput {
  userId: string;
  tokenInfo: TokenInfo;
  deviceInfo: string | null;
  userAgent: string | null;
  ipAddress: string | null;
}

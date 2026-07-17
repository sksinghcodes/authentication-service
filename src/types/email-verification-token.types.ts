export interface EmailVerificationTokenCreateRepoInput {
  user_id: string;
  token_hash: string;
  expires_at: Date;
}

export interface EmailVerificationTokenFindRepoOutput {
  id: string;
  user_id: string;
  expires_at: Date;
}

export interface CreateEmailTokenInput {
  user_id: string;
  token_hash: string;
  expires_at: Date;
}

export interface EmailVerificationTokenPublic {
  id: string;
  user_id: string;
  expires_at: Date;
}

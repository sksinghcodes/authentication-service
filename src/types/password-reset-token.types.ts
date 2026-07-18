export interface PasswordResetTokenCreateRepoInput {
  user_id: string;
  token_hash: string;
  expires_at: Date;
}

export interface PasswordResetTokenFindRepoOutput {
  id: string;
  user_id: string;
  expires_at: Date;
}

export interface TokenAndNewPassword {
  token: string;
  newPassword: string;
}

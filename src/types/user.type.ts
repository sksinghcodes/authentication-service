export interface UserLoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface UserRegisterRequest {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  password: string;
}

export interface UserCreateRepoInput {
  first_name: string | null;
  last_name: string | null;
  username: string;
  email: string;
  password_hash: string;
}

export interface UserCreateRepoOutput {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string;
  email: string;
}

export interface UserFindRepoOutputPrivate {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string;
  email: string;
  email_verified_at: Date | null;
  password_hash: string;
}

export interface UserFindRepoOutputSelf {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string;
  email: string;
  email_verified_at: Date | null;
}

export interface UserPublicResponse {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string;
}

export interface UserSelfResponse {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string;
  email: string;
  email_is_verified: boolean;
}

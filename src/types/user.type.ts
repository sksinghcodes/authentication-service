export interface RegisteredUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string;
  email: string;
}

export interface RegisterRequest {
  first_name?: string;
  last_name?: string;
  email: string;
  username: string;
  password: string;
}

export interface CreateUserInput {
  first_name?: string;
  last_name?: string;
  email: string;
  username: string;
  password_hash: string;
}

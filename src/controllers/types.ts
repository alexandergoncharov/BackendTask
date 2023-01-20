export interface InfoResponse {
  info: string;
}

export interface AuthorResponse {
  authorId: number;
  name: string;
}

export interface UserParams {
  email: string;
  password: string;
  fullname?: string;
}

export interface TokenResponse {
  token: string;
}

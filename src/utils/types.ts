export interface InfoResponse {
  info: string;
}

export interface AuthorResponse {
  authorId: number;
  name: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface UserParams extends LoginParams {
  fullname: string;
}

export interface TokenResponse {
  token: string;
}

export interface ProfileRespons {
  fullname: string;
  email: string;
}

export interface QuoteRepsonse {
  authorId: number;
  quoteId: number;
  quote: string;
}

export interface ErrorMessageResponse {
  message: string;
}

export interface Response {
  success: boolean;
  data:
    | InfoResponse
    | TokenResponse
    | AuthorResponse
    | ProfileRespons
    | QuoteRepsonse
    | ErrorMessageResponse
    | {};
}

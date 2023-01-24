export const VALIDATION_ERROR: string = "Wrong validation token";
export const UNKNOW_ERROR: string = "Unknow Error";
export const WRONG_EMAIL_OR_PASSWORD: string = "Wrong Email or Password";
export const DUPLICATED_EMAIL_ERROR: string = "Email already exist";
export const INFO_MESSAGE = "Some information about the <b>company</b>.";

export const DELAY_IN_MS: number = 5000;

export enum StatusCode {
  Successful = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Duplicated = 409,
}

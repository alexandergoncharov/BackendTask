export const validationErrorMessage: string = "Wrong validation token";
export const unknowError: string = "Unknow Error";
export const wrongEmailOrPassword: string = "Wrong Email or Password";
export const duplicateEmailError: string = "Email already exist";
export const infoMessage = "Some information about the <b>company</b>.";

export const delayMs: number = 5000;

export enum StatusCode {
  Successful = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Duplicated = 409,
}

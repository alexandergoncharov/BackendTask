import { InfoResponse, AuthorResponse } from "./types";
import { getAuthor } from "../repositories/author";

export default class Controller {
  public async getInfo(): Promise<InfoResponse> {
    return {
      info: "Some information about the <b>company</b>.",
    };
  }

  public async getAuthor(): Promise<AuthorResponse[]> {
    return getAuthor();
  }
}

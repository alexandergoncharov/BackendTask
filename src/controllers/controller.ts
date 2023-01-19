import { InfoResponse, AuthorResponse } from "./types";

export default class Controller {
  public async getInfo(): Promise<InfoResponse> {
    return {
      info: "Some information about the <b>company</b>.",
    };
  }

  public async getAuthor(): Promise<AuthorResponse> {
    // Mock data from db
    return {
      authorId: 1,
      name: "Charlie Chaplin",
    };
  }
}

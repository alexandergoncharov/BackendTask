import { InfoResponse } from "./types";

export default class Controller {
  public async getInfo(): Promise<InfoResponse> {
    return {
      info: "Some information about the <b>company</b>.",
    };
  }
}

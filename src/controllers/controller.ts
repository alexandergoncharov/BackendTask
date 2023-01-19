interface Response {
  message: string;
}

export default class Controller {
  public async getMessage(): Promise<Response> {
    return {
      message: "Hello world",
    };
  }
}

import {
  InfoResponse,
  AuthorResponse,
  UserParams,
  TokenResponse,
} from "./types";
import { getAuthor } from "../repositories/author";
import { addUser, loginUser, validateToken } from "../repositories/user";
import { User } from "../models/user";

export default class Controller {
  public async validateToken(token: string): Promise<User | null> {
    return validateToken(token);
  }
}

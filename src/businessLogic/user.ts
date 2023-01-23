import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models";
import { duplicateEmailError, wrongEmailOrPassword } from "../utils/const";
import { LoginParams, UserParams } from "../utils/types";
import { getUser, insertUser } from "../repositories/user";
import { insertToken } from "../repositories/token";

export const addUser = async (user: UserParams) => {
  const checkUser: User | null = await getUser(user.email);
  if (checkUser) {
    throw new Error(duplicateEmailError);
  }
    
  const encryptedUser: UserParams = { ...user };
  encryptedUser.password = bcrypt.hashSync(user.password, 10);

  await insertUser(encryptedUser);
};

export const loginUser = async (userParams: LoginParams): Promise<string> => {
  const user: User | null = await getUser(userParams.email);
  if (!user) {
    throw new Error(wrongEmailOrPassword);
  }

  const matches = bcrypt.compareSync(userParams.password, user.password);
  if (!matches) {
    throw new Error(wrongEmailOrPassword);
  }

  const token = uuidv4();
  await insertToken(token, user);

  return token;
};

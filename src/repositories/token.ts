import { appDataSource } from "..";
import { User } from "../models";
import { Token } from "../models/token";

export const insertToken = async (token: string, user: User): Promise<void> => {
  const tokenRepository = appDataSource.getRepository(Token);
  await tokenRepository.insert({ token, user });
};

export const getUserByToken = async (token: string): Promise<User | null> => {
  const tokenRepository = appDataSource.getRepository(Token);

  const tokenObject = await tokenRepository.findOne({
    relations: ["user"],
    where: { token },
  });

  if (!tokenObject) {
    return null;
  }

  return tokenObject.user;
};

export const deleteToken = async (token: string): Promise<void> => {
  const tokenRepository = appDataSource.getRepository(Token);

  await tokenRepository.delete({ token });
};

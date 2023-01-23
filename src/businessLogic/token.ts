import { User } from "../models";
import { deleteToken, getUserByToken } from "../repositories/token";

export const validateToken = async (token: string): Promise<User | null> => {
  return await getUserByToken(token);
};

export const logout = async (token: string): Promise<void> => {
  await deleteToken(token);
};

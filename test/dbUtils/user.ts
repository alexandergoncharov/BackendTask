import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { appDataSource } from "../../src";
import { Token, User } from "../../src/models";
import { UserParams } from "../../src/utils/types";

export const decryptedPassword = "123";

export const createUser = async (): Promise<User> => {
  const password: string = decryptedPassword;
  const ecryptedPassword: string = bcrypt.hashSync(password, 10);
  const userParams: UserParams = {
    fullname: "testFullName",
    email: "test@email.com" + uuidv4(),
    password: ecryptedPassword,
  };

  const userRepository = appDataSource.getRepository(User);
  await userRepository.insert(userParams);

  const user: User | null = await userRepository.findOne({
    where: { email: userParams.email },
  });

  return user!;
};

export const createUserToken = async (user: User): Promise<string> => {
  const tokenRepository = appDataSource.getRepository(Token);
  const token: string = uuidv4();

  await tokenRepository.insert({ token, user });

  return token;
};

export const getUserByEmail = async (email: string) => {
  const userRepository = appDataSource.getRepository(User);

  const user: User | null = await userRepository.findOne({ where: { email } });

  return user!;
};

export const getToken = async (user: User): Promise<Token | null> => {
  const tokenRepository = appDataSource.getRepository(Token);

  const token = await tokenRepository.findOne({ where: { user } });

  return token;
};

export const deleteUser = async (user: User): Promise<void> => {
  const userRepository = appDataSource.getRepository(User);
  await userRepository.delete({ id: user.id });
};

export const deleteToken = async (token: string): Promise<void> => {
  const userRepository = appDataSource.getRepository(Token);
  await userRepository.delete({ token });
};

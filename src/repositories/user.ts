import { User, Token } from "../models";
import { appDataSource } from "..";
import { TokenResponse, UserParams } from "../controllers/types";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export const addUser = async (user: UserParams): Promise<User> => {
  const userRepository = appDataSource.getRepository(User);

  const userListWithSameEmail = await userRepository.find({
    where: { email: user.email },
  });

  if (userListWithSameEmail.length > 0) {
    throw new Error("Duplicated email");
  }

  const passwordEncryptedUser: UserParams = { ...user };
  passwordEncryptedUser.password = bcrypt.hashSync(
    passwordEncryptedUser.password,
    10
  );
  const insertResult = await userRepository.insert(passwordEncryptedUser);

  return insertResult.raw;
};

export const loginUser = async (
  userParams: UserParams
): Promise<TokenResponse> => {
  const userRepository = appDataSource.getRepository(User);
  const tokenRepository = appDataSource.getRepository(Token);

  const user = await userRepository.findOne({
    where: { email: userParams.email },
  });
  if (!user) {
    throw new Error("Wrong Email or Password");
  }

  const matches = bcrypt.compareSync(userParams.password, user.password);
  if (!matches) {
    throw new Error("Wrong Email or Password");
  }

  const uuid = uuidv4();
  await tokenRepository.insert({ token: uuid, user });
  
  const tokenResponse: TokenResponse = { token: uuid };
  return tokenResponse;
};

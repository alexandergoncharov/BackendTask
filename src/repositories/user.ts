import { User } from "../models";
import { appDataSource } from "..";
import { UserParams } from "../controllers/types";
import bcrypt from "bcrypt";

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

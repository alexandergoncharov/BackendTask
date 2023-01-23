import { User } from "../models";
import { appDataSource } from "..";
import { UserParams } from "../utils/types";

export const insertUser = async (user: UserParams): Promise<User> => {
  const userRepository = appDataSource.getRepository(User);

  // const userListWithSameEmail = await userRepository.find({
  //   where: { email: user.email },
  // });

  // if (userListWithSameEmail.length > 0) {
  //   throw new Error("Duplicated email");
  // }

  const insertResult = await userRepository.insert(user);

  return insertResult.raw;
};

export const getUser = async (email: string): Promise<User | null> => {
  const userRepository = appDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { email },
  });

  return user;
};

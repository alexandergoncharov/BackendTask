import { Author } from "../models";
import { appDataSource } from ".."; 


export const getAuthor = async (): Promise<Array<Author>> => {
    const userRepository = appDataSource.getRepository(Author);
    return userRepository.find();
  };
  
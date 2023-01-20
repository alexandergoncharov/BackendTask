import { Author } from "../models";
import { appDataSource } from ".."; 


export const getAuthor = async (): Promise<Array<Author>> => {
    const authorRepository = appDataSource.getRepository(Author);
    return authorRepository.find();
  };
  
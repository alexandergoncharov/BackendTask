import { Author } from "../models";
import { appDataSource } from "..";

export const getAuthors = async (): Promise<Array<Author>> => {
  const authorRepository = appDataSource.getRepository(Author);
  return authorRepository.find();
};

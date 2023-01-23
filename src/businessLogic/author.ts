import { Author } from "../models";
import { appDataSource } from "..";
import { getAuthors } from "../repositories/author";
import { randomNumber } from "./utils";

export const getRandomAuthor = async (): Promise<Author> => {
  const authorList: Author[] = await getAuthors();
  const randomAuthorIndex: number = randomNumber(0, authorList.length - 1);
  
  return authorList[randomAuthorIndex];
};

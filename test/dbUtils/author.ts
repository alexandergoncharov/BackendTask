import { v4 as uuidv4 } from "uuid";
import { appDataSource } from "../../src";
import { Author } from "../../src/models";

export const getAllAuthors = (): Promise<Author[]> => {
  const authorRepository = appDataSource.getRepository(Author);
  return authorRepository.find();
};

export const createAuthor = async (): Promise<Author> => {
  const authorRepository = appDataSource.getRepository(Author);
  const authorParams = {
    name: "testName" + uuidv4(), // For uniq name
  };

  const insertResult = await authorRepository.insert(authorParams);
  const author: Author = insertResult.raw;

  return author;
};

export const deleteAuthor = async (author: Author): Promise<void> => {
  const authorRepository = appDataSource.getRepository(Author);
  await authorRepository.delete(author);
};

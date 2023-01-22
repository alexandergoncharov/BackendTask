import { Quote } from "../models";
import { appDataSource } from "..";

export const getQuotes = async (authorId: number): Promise<Array<Quote>> => {
  const quoteRepository = appDataSource.getRepository(Quote);
  const result = await quoteRepository.find({
    relations: ["author"],
    where: { author: { authorId } },
  });

  return result;
};

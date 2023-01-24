import { v4 as uuidv4 } from "uuid";
import { appDataSource } from "../../src";
import { Author, Quote } from "../../src/models";

export const createQuote = async (author: Author): Promise<Quote> => {
  const quoteRepository = appDataSource.getRepository(Quote);
  const quoteText = "testQuote" + uuidv4(); // For uniq quote

  await quoteRepository.insert({ quote: quoteText, author });

  const quote = await quoteRepository.findOne({
    relations: ["author"],
    where: { quote: quoteText },
  });

  return quote!;
};

export const deleteQuote = async (quote: Quote) => {
  const quoteRepository = appDataSource.getRepository(Quote);

  await quoteRepository.delete(quote);
};

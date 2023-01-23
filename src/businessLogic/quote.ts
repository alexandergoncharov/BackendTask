import { Quote } from "../models";
import { getQuotes } from "../repositories/quote";
import { randomNumber } from "./utils";

export const getRandomQuote = async (authorId: number): Promise<Quote> => {
  const quoteList = await getQuotes(authorId);

  const randomQuoteIndex: number = randomNumber(0, quoteList.length - 1);
  const randomQuote: Quote = quoteList[randomQuoteIndex];

  return randomQuote;
};

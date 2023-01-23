import { Author, Quote, User } from "../models";
import { AuthorResponse, ProfileRespons, QuoteRepsonse } from "./types";

export const toAuthtorResponse = (author: Author): AuthorResponse => {
  const responseAuthor: AuthorResponse = {
    authorId: author.authorId,
    name: author.name,
  };

  return responseAuthor;
};

export const toQuoteRepsonse = (quote: Quote): QuoteRepsonse => {
  const quoteRepsonse: QuoteRepsonse = {
    authorId: quote.author.authorId,
    quoteId: quote.quoteId,
    quote: quote.quote,
  };

  return quoteRepsonse;
};

export const toProfileResponse = (user: User): ProfileRespons => {
  const profileResponse: ProfileRespons = {
    fullname: user.fullname,
    email: user.email,
  };

  return profileResponse;
};

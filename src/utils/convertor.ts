import { Author, Quote, User } from "../models";
import {
  Response,
  AuthorResponse,
  ProfileRespons,
  QuoteRepsonse,
  InfoResponse,
} from "./types";

export const toInfoResponse = (infoMessage: string): Response => {
  const infoResponse: InfoResponse = { info: infoMessage };

  return toResponse(infoResponse);
};

export const toAuthtorResponse = (author: Author): Response => {
  const responseAuthor: AuthorResponse = {
    authorId: author.id,
    name: author.name,
  };

  return toResponse(responseAuthor);
};

export const toQuoteRepsonse = (quote: Quote): Response => {
  const quoteRepsonse: QuoteRepsonse = {
    authorId: quote.author.id,
    quoteId: quote.quoteId,
    quote: quote.quote,
  };

  return toResponse(quoteRepsonse);
};

export const toProfileResponse = (user: User): Response => {
  const profileResponse: ProfileRespons = {
    fullname: user.fullname,
    email: user.email,
  };

  return toResponse(profileResponse);
};

export const getEmptyResponse = (): Response => {
  return toResponse({});
}

const toResponse = (
  data: ProfileRespons | QuoteRepsonse | AuthorResponse | InfoResponse | {}
): Response => {
  const response: Response = { success: true, data };

  return response;
};

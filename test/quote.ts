import chai from "chai";
import supertest from "supertest";
import { server } from "../src/index";
import { User } from "../src/models";
import { deleteToken } from "../src/repositories/token";
import { QuoteRepsonse } from "../src/utils/types";
import { createAuthor, deleteAuthor, getAllAuthors } from "./dbUtils/author";
import { createQuote, deleteQuote } from "./dbUtils/quote";
import { createUser, createUserToken, deleteUser } from "./dbUtils/user";

const app = supertest(server);
const { expect } = chai;

describe("Author api", () => {
  describe("for non authorized users", async () => {
    it("/quote should return 401 if token missed", async () => {
      await app.get("/quote").expect(401);
    });

    it("/quote should return 401 if token is invalid", async () => {
      await app.get("/quote?token=invalidToken").expect(404);
    });
  });

  describe("for authorized users", () => {
    let user: User;
    let token: string;

    before(async () => {
      user = await createUser();
      token = await createUserToken(user);
    });

    after(async () => {
      await deleteToken(token);
      await deleteUser(user);
    });

    it("/quote should return 404 if authorId is not provided", async () => {
      await app.get(`/quote?token=${token}`).expect(404);
    });

    it("/quote should return random quote for provided authorId", async () => {
      const author = await createAuthor();
      const quote1 = await createQuote(author);
      const quote2 = await createQuote(author);

      try {
        const response = await app
          .get(`/quote?token=${token}&authorId=${author.id}`)
          .expect(200);
        const quoteResponse: QuoteRepsonse = response.body;

        const allQuotes = [quote1, quote2];
        const isQuoteExists = allQuotes.some(
          (quote) =>
            quote.quoteId === quoteResponse.quoteId &&
            quote.author.id === quoteResponse.authorId &&
            quote.quote === quoteResponse.quote
        );

        expect(isQuoteExists).to.be.true;
      } finally {
        await deleteQuote(quote1);
        await deleteQuote(quote2);
        await deleteAuthor(author);
      }
    }).timeout(10000);
  });
});

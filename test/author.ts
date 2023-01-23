import chai from "chai";
import supertest from "supertest";
import { server } from "../src/index";
import { User } from "../src/models";
import { deleteToken } from "../src/repositories/token";
import { createAuthor, deleteAuthor, getAllAuthors } from "./dbUtils/author";
import { createUser, createUserToken, deleteUser } from "./dbUtils/user";

const app = supertest(server);
const { expect } = chai;

describe("Author api", () => {
  describe("for non authorized users", async () => {
    it("/author should return 401 if token missed", async () => {
      await app.get("/author").expect(401);
    });

    it("/author should return 401 if token is invalid", async () => {
      await app.get("/author?token=invalidToken").expect(401);
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

    it("/author should return random author", async () => {
      const author1 = await createAuthor();
      const author2 = await createAuthor();

      try {
        const response = await app.get(`/author?token=${token}`).expect(200);
        const responseAuthor = response.body;

        const allAuthors = await getAllAuthors();

        const isAuthorExists = allAuthors.some(
          (author) =>
            author.authorId === responseAuthor.authorId &&
            author.name === responseAuthor.name
        );

        expect(isAuthorExists).to.be.true;
      } finally {
        await deleteAuthor(author1);
        await deleteAuthor(author2);
      }
    }).timeout(10000);
  });
});

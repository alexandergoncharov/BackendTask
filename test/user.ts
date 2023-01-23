import chai from "chai";
import supertest from "supertest";
import { server } from "../src/index";
import { User } from "../src/models";
import { deleteToken } from "../src/repositories/token";
import { UserParams } from "../src/utils/types";
import { createAuthor, deleteAuthor, getAllAuthors } from "./dbUtils/author";
import {
  createUser,
  deleteUser,
  getUserByEmail,
} from "./dbUtils/user";

const app = supertest(server);
const { expect } = chai;

const user: UserParams = {
  fullname: "testFullName",
  email: "test@email.com",
  password: "1234",
};

describe("User api", () => {
  describe("/register", async () => {
    let testUser: User;

    afterEach(async () => {
      await deleteUser(testUser);
    });

    it("should register new user", async () => {
      await app.post("/register").send(user).expect(200);

      testUser = await getUserByEmail(user.email);

      expect(testUser.fullname).to.equal(user.fullname);
    });

    it("should return 409 if email duplicated", async () => {
      await app.post("/register").send(user).expect(200);
      testUser = await getUserByEmail(user.email);

      await app.post("/register").send(user).expect(409);
    });
  });

  describe("/login", () => {
    let testUser: User;

    before(async () => {
      testUser = await createUser();
    });

    after(async () => {
      await deleteUser(testUser);
    });

    it("should return token when credentials are valid", async () => {
      const loginResponse = await app
        .post("/login")
        .send({ email: testUser.email, password: "123" })
        .expect(200);

      console.log(loginResponse.body);

      expect(loginResponse.body).to.exist;
      const token: string = loginResponse.body.token;
      expect(token).to.exist;

      await app.get(`/profile?token=${token}`).expect(200);
      
      await deleteToken(token);
    });
  });
});

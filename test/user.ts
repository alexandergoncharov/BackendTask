import chai from "chai";
import supertest from "supertest";
import { server } from "../src/index";
import { User } from "../src/models";
import { deleteToken } from "../src/repositories/token";
import { UserParams } from "../src/utils/types";
import { createAuthor, deleteAuthor, getAllAuthors } from "./dbUtils/author";
import {
  createUser,
  createUserToken,
  decryptedPassword,
  deleteUser,
  getToken,
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
        .send({ email: testUser.email, password: decryptedPassword })
        .expect(200);

      console.log(loginResponse.body);

      expect(loginResponse.body).to.exist;
      const token: string = loginResponse.body.token;
      expect(token).to.exist;

      await app.get(`/profile?token=${token}`).expect(200);

      await deleteToken(token);
    });
  });

  describe("/profile", () => {
    it("should return 401 if token is missed", async () => {
      await app.get("/profile").expect(401);
    });

    it("should return 401 if token is invalid", async () => {
      await app.get("/profile?token=invalidToken").expect(403);
    });

    describe("for authorized users", async () => {
      let token: string;
      let user: User;

      before(async () => {
        user = await createUser();
        token = await createUserToken(user);
      });

      after(async () => {
        await deleteToken(token);
        await deleteUser(user);
      });

      it("should return user profile ", async () => {
        const response = await app.get(`/profile?token=${token}`).expect(200);

        expect(response.body.fullname).to.equal(user.fullname);
        expect(response.body.email).to.equal(user.email);
      });
    });
  });

  describe("/logout", () => {
    it("should return 401 if token is missed", async () => {
      await app.delete("/logout").expect(401);
    });

    describe("for authorized users", async () => {
      let token: string;
      let user: User;

      before(async () => {
        user = await createUser();
        token = await createUserToken(user);
      });

      after(async () => {
        await deleteToken(token);
        await deleteUser(user);
      });

      it("should remove user token", async () => {
        await app.delete(`/logout?token=${token}`).expect(200);
        const deletedToken = await getToken(user);

        expect(deletedToken).to.not.exist;
      });
    });
  });
});

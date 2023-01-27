import chai from "chai";
import supertest from "supertest";
import { server } from "../src/index";
import { INFO_MESSAGE } from "../src/utils/const";

const app = supertest(server);
const { expect } = chai;

describe("Public info api", () => {
  it("/info should return information for main page", async () => {
    const infoResponse = await app.get("/info").expect(200);

    expect(infoResponse.body.data.info).to.equal(INFO_MESSAGE);
  });
});

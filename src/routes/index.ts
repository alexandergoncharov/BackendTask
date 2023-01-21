import express from "express";
import {
  AuthorResponse,
  InfoResponse,
  ProfileRespons,
} from "../models/types";
import { User } from "../models/user";
import { getAuthor } from "../repositories/author";
import { addUser, loginUser, validateToken } from "../repositories/user";

const router = express.Router();

const infoMessage = "Some information about the <b>company</b>.";

router.get("/info", async (req, res) => {
  const infoResponse: InfoResponse = { info: infoMessage };

  return res.send(infoResponse);
});

router.get("/author", async (req, res) => {
  const response: AuthorResponse[] = await getAuthor();

  return res.send(response);
});

router.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;
  if (fullname == null || email == null || password == null) {
    return res.sendStatus(403);
  }

  try {
    await addUser({
      fullname,
      email,
      password,
    });

    return res.sendStatus(200);
  } catch (error) {
    let message = "Unknow Error";

    if (error instanceof Error) message = error.message;

    res.status(400).send(message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email == null || password == null) {
    return res.sendStatus(403);
  }

  try {
    const token = await loginUser({
      email,
      password,
    });

    return res.status(200).send(token);
  } catch (error) {
    let message = "Unknow Error";

    if (error instanceof Error) message = error.message;

    return res.status(400).send(message);
  }
});

router.get("/profile", async (req, res) => {
  const token: string = req.query.token as string;
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user: User | null = await validateToken(token);

    if (!user) {
      return res.status(498).send("Wrong validation token");
    }

    const profileResponse: ProfileRespons = {
      fullname: user.fullname,
      email: user.email,
    };

    res.status(200).send(profileResponse);
  } catch (error) {
    let message = "Unknow Error";

    if (error instanceof Error) message = error.message;

    return res.status(400).send(message);
  }
});

export default router;

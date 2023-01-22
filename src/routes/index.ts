import express from "express";
import { Quote } from "../models";
import {
  AuthorResponse,
  InfoResponse,
  ProfileRespons,
  QuoteRepsonse,
} from "../models/types";
import { User } from "../models/user";
import { getAuthor } from "../repositories/author";
import { getQuotes } from "../repositories/quote";
import { addUser, deleteToken, loginUser, validateToken } from "../repositories/user";

const router = express.Router();

const infoMessage = "Some information about the <b>company</b>.";

router.get("/info", async (req, res) => {
  const infoResponse: InfoResponse = { info: infoMessage };

  return res.send(infoResponse);
});

router.get("/author", async (req, res) => {
  const token: string = req.query.token as string;
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user: User | null = await validateToken(token);
    if (!user) {
      return res.status(498).send("Wrong validation token");
    }

    await delay(5000);

    const authorList: AuthorResponse[] = await getAuthor();
    const randomAuthorIndex: number = randomNumber(0, authorList.length - 1);
    const randomAuthor: AuthorResponse = authorList[randomAuthorIndex];

    return res.send(randomAuthor);
  } catch (error) {
    const message = handleErrorMessage(error as Error);
    res.status(400).send(message);
  }
});

router.get("/quote", async (req, res) => {
  const token: string = req.query.token as string;
  const authorId: number = parseInt(req.query.authorId as string);
  if (!token) {
    return res.sendStatus(401);
  }
  if (!authorId) {
    return res.sendStatus(404);
  }

  try {
    const user: User | null = await validateToken(token);
    if (!user) {
      return res.status(498).send("Wrong validation token");
    }

    await delay(5000);

    const quoteList = await getQuotes(authorId);
    if (quoteList.length === 0) {
      return res.send([]);
    }

    const randomQuoteIndex: number = randomNumber(0, quoteList.length - 1);
    const randomQuote: Quote = quoteList[randomQuoteIndex];
    const quoteRepsonse: QuoteRepsonse = {
      authorId: randomQuote.author.authorId,
      quoteId: randomQuote.quoteId,
      quote: randomQuote.quote,
    };

    return res.send(quoteRepsonse);
  } catch (error) {
    const message = handleErrorMessage(error as Error);
    res.status(400).send(message);
  }
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
    const message = handleErrorMessage(error as Error);
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
    const message = handleErrorMessage(error as Error);
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
    const message = handleErrorMessage(error as Error);
    return res.status(400).send(message);
  }
});

router.delete("/logout", async (req, res) => {
  const token: string = req.query.token as string;
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user: User | null = await validateToken(token);
    if (!user) {
      return res.status(498).send("Wrong validation token");
    }

    await deleteToken(token);

    res.sendStatus(200);
  } catch (error) {
    const message = handleErrorMessage(error as Error);
    return res.status(400).send(message);
  }
});

const handleErrorMessage = (error: Error) => {
  let message = "Unknow Error";

  if (error instanceof Error) message = error.message;

  return message;
};

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default router;

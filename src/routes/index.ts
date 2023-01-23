import express from "express";
import { getRandomAuthor } from "../businessLogic/author";
import { getRandomQuote } from "../businessLogic/quote";
import { logout, validateToken } from "../businessLogic/token";
import { addUser, loginUser } from "../businessLogic/user";
import { Author, Quote } from "../models";
import {
  AuthorResponse,
  InfoResponse,
  ProfileRespons,
  QuoteRepsonse,
} from "../models/types";
import { User } from "../models/user";

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

    const author: Author = await getRandomAuthor();
    const responseAuthor: AuthorResponse = {
      authorId: author.authorId,
      name: author.name,
    };

    return res.send(responseAuthor);
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

    const quote: Quote = await getRandomQuote(authorId);
    const quoteRepsonse: QuoteRepsonse = {
      authorId: quote.author.authorId,
      quoteId: quote.quoteId,
      quote: quote.quote,
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
    return res.status(400).send(message);
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

    await logout(token);

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

export default router;

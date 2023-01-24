import express from "express";
import { getRandomAuthor } from "../businessLogic/author";
import { getRandomQuote } from "../businessLogic/quote";
import { logout, validateToken } from "../businessLogic/token";
import { addUser, loginUser } from "../businessLogic/user";
import { Author, Quote } from "../models";
import {
  DELAY_IN_MS,
  DUPLICATED_EMAIL_ERROR,
  INFO_MESSAGE,
  StatusCode,
  UNKNOW_ERROR,
  VALIDATION_ERROR,
} from "../utils/const";
import {
  AuthorResponse,
  InfoResponse,
  ProfileRespons,
  QuoteRepsonse,
} from "../utils/types";
import { User } from "../models/user";
import {
  toAuthtorResponse,
  toProfileResponse,
  toQuoteRepsonse,
} from "../utils/convertor";

const router = express.Router();

router.get("/info", async (req, res) => {
  const infoResponse: InfoResponse = { info: INFO_MESSAGE };

  return res.send(infoResponse);
});

router.get("/author", async (req, res) => {
  const token: string = req.query.token as string;
  if (!token) {
    return res.sendStatus(StatusCode.Unauthorized);
  }

  try {
    const user: User | null = await validateToken(token);
    if (!user) {
      return res.status(StatusCode.Unauthorized).send(VALIDATION_ERROR);
    }

    await delay(DELAY_IN_MS);

    const author: Author = await getRandomAuthor();
    const responseAuthor: AuthorResponse = toAuthtorResponse(author);

    return res.send(responseAuthor);
  } catch (error) {
    const { message, statusCode } = handleErrorMessage(error as Error);
    return res.status(statusCode).send(message);
  }
});

router.get("/quote", async (req, res) => {
  const token: string = req.query.token as string;
  const authorId: number = parseInt(req.query.authorId as string);
  if (!token) {
    return res.sendStatus(StatusCode.Unauthorized);
  }
  if (!authorId) {
    return res.sendStatus(StatusCode.NotFound);
  }

  try {
    const user: User | null = await validateToken(token);
    if (!user) {
      return res.status(StatusCode.Unauthorized).send(VALIDATION_ERROR);
    }

    await delay(DELAY_IN_MS);

    const quote: Quote = await getRandomQuote(authorId);
    const quoteRepsonse: QuoteRepsonse = toQuoteRepsonse(quote);

    return res.send(quoteRepsonse);
  } catch (error) {
    const { message, statusCode } = handleErrorMessage(error as Error);
    return res.status(statusCode).send(message);
  }
});

router.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;
  if (fullname == null || email == null || password == null) {
    return res.sendStatus(StatusCode.Unauthorized);
  }

  try {
    await addUser({
      fullname,
      email,
      password,
    });

    return res.sendStatus(StatusCode.Successful);
  } catch (error) {
    const { message, statusCode } = handleErrorMessage(error as Error);
    return res.status(statusCode).send(message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email == null || password == null) {
    return res.sendStatus(StatusCode.Unauthorized);
  }

  try {
    const token = await loginUser({
      email,
      password,
    });

    return res.status(StatusCode.Successful).send({ token });
  } catch (error) {
    const { message, statusCode } = handleErrorMessage(error as Error);
    return res.status(statusCode).send(message);
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
      return res.status(403).send(VALIDATION_ERROR);
    }

    const profileResponse: ProfileRespons = toProfileResponse(user);

    res.status(StatusCode.Successful).send(profileResponse);
  } catch (error) {
    const { message, statusCode } = handleErrorMessage(error as Error);
    return res.status(statusCode).send(message);
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
      return res.status(403).send(VALIDATION_ERROR);
    }

    await logout(token);

    res.sendStatus(StatusCode.Successful);
  } catch (error) {
    const { message, statusCode } = handleErrorMessage(error as Error);
    return res.status(statusCode).send(message);
  }
});

const handleErrorMessage = (error: Error) => {
  let message = UNKNOW_ERROR;
  let statusCode = StatusCode.BadRequest;

  if (error instanceof Error) message = error.message;

  if (error instanceof Error && error.message === DUPLICATED_EMAIL_ERROR)
    statusCode = StatusCode.Duplicated;

  return { message, statusCode };
};

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default router;

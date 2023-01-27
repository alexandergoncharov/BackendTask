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
import { Response } from "../utils/types";
import { User } from "../models/user";
import {
  getEmptyResponse,
  toAuthtorResponse,
  toInfoResponse,
  toProfileResponse,
  toQuoteRepsonse,
  toTokenResponse,
} from "../utils/convertor";

const router = express.Router();

router.get("/info", async (req, res) => {
  const infoResponse: Response = toInfoResponse(INFO_MESSAGE);

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
    const response: Response = toAuthtorResponse(author);

    return res.send(response);
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
    const repsonse: Response = toQuoteRepsonse(quote);

    return res.send(repsonse);
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

    const response: Response = getEmptyResponse();

    return res.status(StatusCode.Successful).send(response);
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

    const tokenResponse: Response = toTokenResponse(token);

    return res.status(StatusCode.Successful).send(tokenResponse);
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

    const response: Response = toProfileResponse(user);

    res.status(StatusCode.Successful).send(response);
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

    const response: Response = getEmptyResponse();

    res.status(StatusCode.Successful).send(response);
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

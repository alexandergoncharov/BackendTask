import express from "express";
import Controller from "../controllers/controller";
import { ProfileRespons } from "../controllers/types";
import { User } from "../models/user";

const router = express.Router();

router.get("/info", async (req, res) => {
  const controller = new Controller();
  const response = await controller.getInfo();
  return res.send(response);
});

router.get("/author", async (req, res) => {
  const controller = new Controller();
  const response = await controller.getAuthor();
  return res.send(response);
});

router.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;
  if (fullname == null || email == null || password == null) {
    return res.sendStatus(403);
  }

  const controller = new Controller();
  try {
    await controller.registryUser({
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

  const controller = new Controller();
  try {
    const token = await controller.loginUser({
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

  const controller = new Controller();
  try {
    const user: User | null = await controller.validateToken(token);

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

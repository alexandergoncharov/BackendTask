import express from "express";
import Controller from "../controllers/controller";

const router = express.Router();

router.get("/info", async (_req, res) => {
  const controller = new Controller();
  const response = await controller.getInfo();
  return res.send(response);
});

router.get("/author", async (_req, res) => {
  const controller = new Controller();
  const response = await controller.getAuthor();
  return res.send(response);
});

export default router;
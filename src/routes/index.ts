import express from "express";
import Controller from "../controllers/controller";

const router = express.Router();

router.get("/", async (_req, res) => {
  const controller = new Controller();
  const response = await controller.getMessage();
  return res.send(response);
});

export default router;
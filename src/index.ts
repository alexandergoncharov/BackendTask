import express, { Application } from "express";

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.get("/", async (_req, res) => {
  res.send({
    message: "Hello world",
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
import express, { Application } from "express";
import morgan from "morgan";

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

app.get("/", async (_req, res) => {
  res.send({
    message: "Hello world",
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

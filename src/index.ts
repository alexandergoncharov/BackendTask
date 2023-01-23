import express, { Application } from "express";
import morgan from "morgan";
import Router from "./routes";
import dbConfig from "./config/database";
import { DataSource } from "typeorm";
import "reflect-metadata";

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(Router);

export const appDataSource = new DataSource(dbConfig);
export const server = app;

appDataSource
  .initialize()
  .then((_connection) => {
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  })
  .catch((err) => {
    console.log("Unable to connect to db", err);
    process.exit(1);
  });
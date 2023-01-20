import { DataSourceOptions } from "typeorm";
import { Author, User, Token } from "../models";

const config: DataSourceOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "987654321",
  database: process.env.POSTGRES_DB || "postgres",
  entities: [Author, User, Token],
  synchronize: true,
};

export default config;

import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

// At initialization, create database first
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "todo_fs",
  synchronize: true,
  logging: false,
  entities: [],
  subscribers: [],
  migrations: [],
});
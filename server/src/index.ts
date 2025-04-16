import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = Number(process.env.APP_PORT);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

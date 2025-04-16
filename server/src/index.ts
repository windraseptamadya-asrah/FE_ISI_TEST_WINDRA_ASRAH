import dotenv from "dotenv";
import express from "express";
import { AppDataSource } from "./data-source";
import { router as root } from "./routes";
import { errorHandler } from "./views/error";

dotenv.config();

const app = express();
const port = Number(process.env.APP_PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", root);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

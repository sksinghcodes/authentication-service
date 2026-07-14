import "dotenv/config";
import express, { type Express, type Request, type Response } from "express";
import authRouter from "./routes/auth.router.js";
import pool from "./config/database.js";
import { PORT } from "./config/env.js";
import errorMiddleware from "./errors/error.middleware.js";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);

app.use(errorMiddleware);

const startServer = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected:", result.rows[0].now);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};
startServer();

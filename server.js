import { config } from "dotenv";
config();

import express from "express";
import prisma from "./db/db_connection.js";
import userRouter from "./routes/user.js";
import categoryRouter from "./routes/category.js";
import recordRouter from "./routes/record.js";
import currencyRouter from "./routes/currency.js";
import authRouter from "./routes/auth.js";
import { middleware } from "./routes/middleware/middleware.js";

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

app.use(middleware);
app.use(userRouter);
app.use(categoryRouter);
app.use(recordRouter);
app.use(currencyRouter);

app.listen(3000, () => console.log("✅ Server is runing on port 3000..."));

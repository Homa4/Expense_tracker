import express from "express";
import prisma from "./db/db_connection.js";
import userRouter from "./routes/user.js";
import categoryRouter from "./routes/category.js";
import recordRouter from "./routes/record.js";
import currencyRouter from "./routes/currency.js";

const app = express();

app.get("/", (req, res) => {
  res("Hello Amigo");
});

app.use(express.json());
app.use(userRouter);
app.use(categoryRouter);
app.use(recordRouter);
app.use(currencyRouter);

app.listen(3000, () => console.log("✅ Server is runing on port 3000..."));

import express from "express";
import "./db/fake_connect.js";
import userRouter from "./routes/user.js";
import categoryRouter from "./routes/category.js";
import recordRouter from "./routes/record.js";

const app = express();

app.get("/", (req, res) => {
  res("Hello Amigo");
});

app.use(userRouter);
app.use(categoryRouter);
app.use(recordRouter);

app.listen(3000);

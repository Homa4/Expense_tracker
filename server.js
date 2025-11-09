import express from "express";
import "./db/fake_connect.js";

const app = express();

app.get("/", (req, res) => {
  res("Hello Amigo");
});

app.listen(3000);

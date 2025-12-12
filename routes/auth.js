import express from "express";
import prisma from "../db/db_connection.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/signUp", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const accessesToken = jwt.sign(
      { name, email, password },
      process.env.SECRETE_KEY,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      { name, email, password },
      process.env.SECRETE_KEY,
      { expiresIn: "15h" }
    );

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      res.statusCode(403);
      return res.json({ message: "User already exist" });
    }

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
        refresh_token: refreshToken,
      },
    });

    console.log("accessesToke", accessesToken);
    console.log("refreshToken", refreshToken);

    const tokens = {
      accessesToken: accessesToken,
      refreshToken: refreshToken,
    };

    res.json(tokens).statusCode(201);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

router.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.SECRETE_KEY, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.SECRETE_KEY,
      { expiresIn: "7d" }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

    return res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;

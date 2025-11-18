import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/users", async (_, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/user/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

router.post("/createUser", async (req, res) => {
  const { name, currency_id = 1 } = req.body;

  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name: name,
        currency_id: currency_id,
      },
    });
    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.delete("/deleteUser/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.user.delete({
      where: { id: id },
    });

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;

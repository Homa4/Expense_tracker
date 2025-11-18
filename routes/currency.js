import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/currensies", async (_, res) => {
  try {
    const coin = await prisma.currency.findMany();
    res.status(200).json(coin);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

router.post("/createCurrency", async (req, res) => {
  const { currency_type } = req.body;
  if (!currency_type)
    return res.status(400).json({ error: "name is required" });
  try {
    const currency = await prisma.currency.findFirst({
      where: {
        currency_type: currency_type,
      },
    });

    if (currency == null) {
      await prisma.currency.create({
        data: {
          currency_type: currency_type,
        },
      });
      res.status(201).json({ message: "Currency added" });
    } else {
      res.status(200).json({ message: "Currency already have been added" });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/deleteCurrency/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.currency.delete({
      where: { id: id },
    });

    res.json({ message: "Currency deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete currency" });
  }
});

export default router;

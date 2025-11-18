import express from "express";
import prisma from "../db/db_connection.js";

const router = express.Router();

router.get("/categories", async (_, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/createCategory", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  try {
    const category = await prisma.category.findFirst({
      where: {
        category_name: name,
      },
    });

    if (category == null) {
      await prisma.category.create({
        data: {
          category_name: name,
        },
      });
      res.status(201).json({ message: "Category created" });
    } else {
      res.status(200).json({ message: "Category already exist" });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/deleteCategory", async (req, res) => {
  const { id } = req.body;
  if (!id && typeof id == "number")
    return res.status(400).json({ error: "id is required" });

  try {
    await prisma.category.delete({
      where: { id },
    });
    res.status(200).json({
      messsage: "category deleted",
    });
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
});

export default router;

import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

const __dirname = path.resolve();
const CATEGORY_PATH = path.join(__dirname, "db", "category.json");

async function readCategories() {
  try {
    const data = await fs.readFile(CATEGORY_PATH, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

async function writeCategories(categories) {
  await fs.writeFile(CATEGORY_PATH, JSON.stringify(categories, null, 2));
}

router.get("/category", async (_, res) => {
  const categories = await readCategories();
  res.json(categories);
});

router.post("/category", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  const categories = await readCategories();
  const newCategory = {
    id: categories.length ? categories[categories.length - 1].id + 1 : 1,
    name,
  };
  categories.push(newCategory);
  await writeCategories(categories);
  res.status(201).json({ message: "Category created", category: newCategory });
});

router.delete("/category/:id", async (req, res) => {
  const categories = await readCategories();
  const newCategories = categories.filter(
    (c) => c.id !== Number(req.params.id)
  );

  if (newCategories.length === categories.length)
    return res.status(404).json({ error: "Category not found" });

  await writeCategories(newCategories);
  res.json({ message: "Category deleted" });
});

export default router;

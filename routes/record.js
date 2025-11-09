import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

const __dirname = path.resolve();
const RECORD_PATH = path.join(__dirname, "db", "record.json");

async function readRecords() {
  try {
    const data = await fs.readFile(RECORD_PATH, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

async function writeRecords(records) {
  await fs.writeFile(RECORD_PATH, JSON.stringify(records, null, 2));
}

router.get("/getRecord/:id", async (req, res) => {
  const records = await readRecords();
  const record = records.find((r) => r.id === Number(req.params.id));
  if (!record) return res.status(404).json({ error: "Record not found" });
  res.json(record);
});

router.get("/getRecordWithFilter", async (req, res) => {
  const { user_id, category_id } = req.body;
  const records = await readRecords();

  if (!user_id || !category_id)
    return res.status(400).json({ error: "Provide user_id or category_id" });

  const filtered = records.filter((r) => {
    let ok = true;
    if (user_id) ok = ok && r.user_id === Number(user_id);
    if (category_id) ok = ok && r.category_id === Number(category_id);
    return ok;
  });

  res.json(filtered);
});

router.post("/createRecord", async (req, res) => {
  const { user_id, category_id, amount, date } = req.body;

  if (!user_id || !category_id || !amount)
    return res
      .status(400)
      .json({ error: "user_id, category_id, and amount are required" });

  const records = await readRecords();
  const newRecord = {
    id: records.length ? records[records.length - 1].id + 1 : 1,
    user_id,
    category_id,
    amount,
    date: date || new Date().toISOString(),
  };
  records.push(newRecord);
  await writeRecords(records);

  res.status(201).json({ message: "Record created", record: newRecord });
});

router.delete("/deleteRecord/:id", async (req, res) => {
  const records = await readRecords();
  const newRecords = records.filter((r) => r.id !== Number(req.params.id));

  if (newRecords.length === records.length)
    return res.status(404).json({ error: "Record not found" });

  await writeRecords(newRecords);
  res.json({ message: "Record deleted" });
});

export default router;

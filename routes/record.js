import express from "express";
import prisma from "../db/db_connection.js";

const router = express.Router();

router.get("/getRecord/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Valid record ID is required" });
  }

  try {
    const record = await prisma.record.findUnique({
      where: { id },
    });

    if (!record) return res.status(404).json({ error: "Record not found" });

    res.status(200).json(record);
  } catch (error) {
    console.error("Error fetching record:", error.message);
    res.status(500).json({ error: "Error fetching record" });
  }
});

router.get("/getRecordWithFilter", async (req, res) => {
  const { user_id, category_id } = req.body;

  if (!user_id && !category_id) {
    return res.status(400).json({
      error: "Provide at least user_id or category_id",
    });
  }

  try {
    const records = await prisma.record.findMany({
      where: {
        ...(user_id && { user_id }),
        ...(category_id && { category_id }),
      },
    });

    res.status(200).json(records);
  } catch (error) {
    console.error("Error filtering records:", error.message);
    res.status(500).json({ error: "Error filtering records" });
  }
});

router.post("/createRecord", async (req, res) => {
  const { user_id, category_id, amount, currency_id = 1 } = req.body;

  const uId = Number(user_id);
  const cId = Number(category_id);
  const ccyId = Number(currency_id);

  if (!uId || !cId || !amount) {
    return res.status(400).json({
      error: "user_id, category_id and amount are required",
    });
  }

  try {
    const newRecord = await prisma.record.create({
      data: {
        date: new Date(),
        amount: String(amount),
        user_id: uId,
        category_id: cId,
        currency_id: ccyId,
      },
    });

    res.status(201).json({
      message: "Record created",
      record: newRecord,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/deleteRecord/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Valid record ID is required" });
  }

  try {
    await prisma.record.delete({
      where: { id },
    });

    res.status(200).json({ message: "Record deleted" });
  } catch (error) {
    console.error("Error deleting record:", error.message);

    res.status(500).json({ error: "Failed to delete record" });
  }
});

export default router;

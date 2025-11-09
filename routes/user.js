import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

const __dirname = path.resolve();
const USERS_PATH = path.join(__dirname, "db", "user.json");

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_PATH, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
}

router.get("/users", async (_, res) => {
  const users = await readUsers();
  res.json(users);
});

router.get("/user/:id", async (req, res) => {
  const users = await readUsers();
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.post("/createUser", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: "name and email required" });

  const users = await readUsers();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email,
  };
  users.push(newUser);
  await writeUsers(users);
  res.status(201).json({ message: "User created", user: newUser });
});

router.delete("/deleteUser/:id", async (req, res) => {
  const users = await readUsers();
  const newUsers = users.filter((u) => u.id !== Number(req.params.id));
  if (newUsers.length === users.length)
    return res.status(404).json({ error: "User not found" });

  await writeUsers(newUsers);
  res.json({ message: "User deleted" });
});

export default router;

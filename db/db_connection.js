import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const test = await prisma.test.findMany();
  console.log(test);
  console.log("✅ connected to db");
} catch (err) {
  console.error(err.message);
  console.log("👹 failed to connect to db");
}

export default prisma;

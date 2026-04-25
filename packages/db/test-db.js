const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log("SUCCESS! Database has", users.length, "users.");
  } catch (e) {
    console.log("DB ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();

import { PrismaClient } from "../prisma/clientCockroach";

const prismaCockroach = new PrismaClient({
  log: ["query"],
});

export default prismaCockroach;

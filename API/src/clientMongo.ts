import { PrismaClient } from "../prisma/clientMongo";

const prismaMongo = new PrismaClient({
  log: ["query"],
});

export default prismaMongo;

import { PrismaClient } from "@prisma/client";
import { isDev } from "./env";

const prisma = new PrismaClient({
  log: isDev ? ["warn", "error"] : ["error"],
});

export default prisma;

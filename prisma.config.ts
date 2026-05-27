import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // ให้ใช้ DIRECT_URL สำหรับให้คำสั่ง Prisma CLI (เช่น db push) วิ่งตรงเข้าฐานข้อมูล
    url: env("DIRECT_URL"),
  },
});
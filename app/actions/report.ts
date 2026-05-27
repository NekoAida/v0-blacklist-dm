"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createReport(data: {
  dmName: string;
  facebook?: string;
  discord?: string;
  reason: string;
  categories: string[];
  evidenceUrl?: string;
}) {
  try {
    const report = await prisma.report.create({
      data,
    })

    // บังคับให้หน้าเว็บดึงข้อมูลใหม่ทันที
    revalidatePath('/')

    return { success: true, data: report }
  } catch (error) {
    console.error("Failed to create report:", error)
    return { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" }
  }
}

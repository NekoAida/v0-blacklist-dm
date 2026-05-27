"use server"

import prisma from "@/lib/prisma"

export async function addReport(data: {
  dmName: string;
  facebook?: string;
  discord?: string;
  reason: string;
  categories: string[];
  evidenceUrl?: string;
}) {
  const report = await prisma.report.create({
    data,
  })
  return report
}

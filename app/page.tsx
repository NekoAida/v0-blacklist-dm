import prisma from "@/lib/prisma";
import ClientPage, { BlacklistReport, CategoryTag } from "@/components/client-page";

export default async function Home() {
  // ดึงข้อมูลจากฐานข้อมูลผ่าน Prisma (เรียงจากใหม่ไปเก่า)
  const dbReports = await prisma.report.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  // แปลงข้อมูลจาก DB schema ให้อยู่ในรูปแบบ BlacklistReport (Type ของ Client Component)
  const initialReports: BlacklistReport[] = dbReports.map(report => ({
    id: report.id,
    dmName: report.dmName,
    facebook: report.facebook || undefined,
    discord: report.discord || undefined,
    reason: report.reason,
    categories: report.categories as CategoryTag[],
    evidenceUrl: report.evidenceUrl || undefined,
    dateReported: report.createdAt.toISOString().split("T")[0],
  }));

  return (
    <ClientPage initialReports={initialReports} />
  );
}
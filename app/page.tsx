"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Shield,
  Search,
  AlertTriangle,
  Plus,
  Calendar,
  Eye,
  Skull,
  Flame,
  Ghost,
  Ban,
  MessageSquareWarning,
  Swords,
  Link2,
  ImageIcon,
  X,
  ScrollText,
  ChevronDown,
  Sparkles,
  Facebook,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ─── Types ───────────────────────────────────────────────────────────

type CategoryTag =
  | "Ghosting"
  | "Harassment"
  | "God Moding"
  | "Scammer"
  | "Rude"
  | "Metagaming"
  | "Cheating"
  | "Favoritism";

interface BlacklistReport {
  id: string;
  dmName: string;
  facebook?: string;
  discord?: string;
  reason: string;
  categories: CategoryTag[];
  evidenceUrl?: string;
  dateReported: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────

const MOCK_REPORTS: BlacklistReport[] = [
  {
    id: "1",
    dmName: "DarkLord_Kevin",
    facebook: "kevin.darklord.dm",
    discord: "DarkLord_Kevin#6666",
    reason:
      "กดดันผู้เล่นอย่างรุนแรง ใช้คำพูดหยาบคาย บังคับให้ตัวละครผู้เล่นตายโดยไม่มีเหตุผลที่สมเหตุสมผล พอผู้เล่นคนใดถามคำถามเกี่ยวกับกฎ จะตะโกนใส่และบอกว่า 'DM is always right' แล้วก็คิกออกจากเซิร์ฟเวอร์ Discord ทันที มีผู้เล่น 3 คนที่ได้รับผลกระทบ",
    categories: ["Harassment", "Rude", "God Moding"],
    evidenceUrl: "https://i.imgur.com/example1.png",
    dateReported: "2026-05-20",
  },
  {
    id: "2",
    dmName: "MysticMage42",
    facebook: "mystic.mage.42",
    reason:
      "รับเงินค่าเซสชัน 500 บาทต่อคน แล้วหายไปเลย ไม่มาเล่นตามนัด ทำแบบนี้ซ้ำกับหลายกลุ่ม พอทวงเงินก็บล็อก ไม่สามารถติดต่อได้อีกเลย มีหลักฐานการโอนเงินและแชทที่นัดหมายกัน",
    categories: ["Scammer", "Ghosting"],
    evidenceUrl: "https://i.imgur.com/example2.png",
    dateReported: "2026-05-18",
  },
  {
    id: "3",
    dmName: "RulebreakerDM",
    discord: "RulebreakerDM#1234",
    reason:
      "ใช้ metagaming ตลอดเวลา NPC รู้ทุกอย่างที่ผู้เล่นพูดคุยกันนอกเกม เปลี่ยนกฎกลางคันเพื่อให้ตัวละคร NPC ของตัวเองชนะเสมอ ลำเอียงกับผู้เล่นบางคนอย่างชัดเจน ทำให้เกมไม่สนุกเลย เล่นมา 4 เซสชันก่อนที่จะทนไม่ไหว",
    categories: ["Cheating", "Metagaming", "Favoritism"],
    dateReported: "2026-05-15",
  },
  {
    id: "4",
    dmName: "PhantomDM_TH",
    facebook: "phantom.dm.thailand",
    discord: "PhantomDM#9999",
    reason:
      "นัดเล่นทุกสัปดาห์ แต่ยกเลิกนาทีสุดท้ายตลอด 5 ครั้งติดต่อกัน ผู้เล่นสร้างตัวละครมาอย่างดี เตรียมตัวมาทุกครั้ง แต่ DM ไม่เคยมา ไม่แจ้งล่วงหน้า บางทีก็ไม่ตอบข้อความเลยจนถึงวันถัดไป",
    categories: ["Ghosting"],
    dateReported: "2026-05-10",
  },
];

// ─── Category Config ─────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  CategoryTag,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  Ghosting: {
    icon: Ghost,
    color: "text-blue-400",
    bgColor: "bg-blue-500/15 border-blue-500/30 text-blue-300",
  },
  Harassment: {
    icon: MessageSquareWarning,
    color: "text-red-400",
    bgColor: "bg-red-500/15 border-red-500/30 text-red-300",
  },
  "God Moding": {
    icon: Swords,
    color: "text-orange-400",
    bgColor: "bg-orange-500/15 border-orange-500/30 text-orange-300",
  },
  Scammer: {
    icon: Ban,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/15 border-yellow-500/30 text-yellow-300",
  },
  Rude: {
    icon: Flame,
    color: "text-rose-400",
    bgColor: "bg-rose-500/15 border-rose-500/30 text-rose-300",
  },
  Metagaming: {
    icon: Eye,
    color: "text-purple-400",
    bgColor: "bg-purple-500/15 border-purple-500/30 text-purple-300",
  },
  Cheating: {
    icon: Skull,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
  },
  Favoritism: {
    icon: Sparkles,
    color: "text-amber-400",
    bgColor: "bg-amber-500/15 border-amber-500/30 text-amber-300",
  },
};

const ALL_CATEGORIES: CategoryTag[] = Object.keys(
  CATEGORY_CONFIG
) as CategoryTag[];

// ─── Floating Particles ──────────────────────────────────────────────

function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 15}s`,
        duration: `${15 + Math.random() * 20}s`,
        size: `${2 + Math.random() * 3}px`,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
            background: `radial-gradient(circle, oklch(0.72 0.18 45 / 0.8), oklch(0.55 0.22 25 / 0.3))`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Stats Bar ───────────────────────────────────────────────────────

function StatsBar({ totalReports }: { totalReports: number }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-4 px-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{totalReports}</p>
          <p className="text-xs text-muted-foreground">รายงานทั้งหมด</p>
        </div>
      </div>
      <div className="w-px h-10 bg-border hidden sm:block" />
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{totalReports}</p>
          <p className="text-xs text-muted-foreground">DM ที่ถูกรายงาน</p>
        </div>
      </div>
      <div className="w-px h-10 bg-border hidden sm:block" />
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10">
          <ScrollText className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">
            {ALL_CATEGORIES.length}
          </p>
          <p className="text-xs text-muted-foreground">ประเภทพฤติกรรม</p>
        </div>
      </div>
    </div>
  );
}

// ─── Evidence Dialog ─────────────────────────────────────────────────

function EvidenceDialog({
  url,
  dmName,
}: {
  url: string;
  dmName: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
          id={`evidence-btn-${dmName}`}
        >
          <Eye className="w-3.5 h-3.5" />
          ดูหลักฐาน
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl glass border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ImageIcon className="w-5 h-5 text-primary" />
            หลักฐาน — {dmName}
          </DialogTitle>
          <DialogDescription>
            ภาพหลักฐานที่แนบมากับการรายงาน
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-full rounded-lg border border-border/50 bg-secondary/30 p-8 flex flex-col items-center gap-3">
            <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground text-center">
              ภาพหลักฐานจะแสดงที่นี่
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
            >
              <Link2 className="w-3 h-3" />
              {url}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Blacklist Card ──────────────────────────────────────────────────

function BlacklistCard({ report }: { report: BlacklistReport }) {
  const formattedDate = new Date(report.dateReported).toLocaleDateString(
    "th-TH",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Card
      className="card-fantasy bg-card/80 border-border/50 backdrop-blur-sm group"
      id={`report-card-${report.id}`}
    >
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/15 border border-destructive/20 shrink-0 group-hover:bg-destructive/25 transition-colors">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg truncate text-foreground">
                {report.dmName}
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 mt-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </CardDescription>
            </div>
          </div>
        </div>

        {/* Social Contacts */}
        {(report.facebook || report.discord) && (
          <div className="flex flex-wrap gap-3 mt-2">
            {report.facebook && (
              <a
                href={`https://facebook.com/${report.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-blue-400 transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span className="truncate max-w-[140px]">{report.facebook}</span>
              </a>
            )}
            {report.discord && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-indigo-400 transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="truncate max-w-[140px]">{report.discord}</span>
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Category Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {report.categories.map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const IconComp = config.icon;
            return (
              <Badge
                key={cat}
                variant="outline"
                className={`${config.bgColor} text-xs font-medium gap-1`}
              >
                <IconComp className="w-3 h-3" />
                {cat}
              </Badge>
            );
          })}
        </div>

        {/* Reason */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {report.reason}
        </p>
      </CardContent>

      <CardFooter className="pt-0 border-t border-border/30 mt-auto">
        <div className="flex items-center justify-between w-full pt-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-primary/60" />
            <span>รายงานโดยผู้เล่น</span>
          </div>
          {report.evidenceUrl && (
            <EvidenceDialog
              url={report.evidenceUrl}
              dmName={report.dmName}
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

// ─── Report DM Dialog ────────────────────────────────────────────────

function ReportDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (report: BlacklistReport) => void;
}) {
  const [dmName, setDmName] = useState("");
  const [facebook, setFacebook] = useState("");
  const [discord, setDiscord] = useState("");
  const [reason, setReason] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryTag[]>(
    []
  );

  const toggleCategory = (cat: CategoryTag) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = () => {
    if (!dmName.trim() || !reason.trim()) return;

    const newReport: BlacklistReport = {
      id: Date.now().toString(),
      dmName: dmName.trim(),
      facebook: facebook.trim() || undefined,
      discord: discord.trim() || undefined,
      reason: reason.trim(),
      categories:
        selectedCategories.length > 0 ? selectedCategories : ["Rude"],
      evidenceUrl: evidenceUrl.trim() || undefined,
      dateReported: new Date().toISOString().split("T")[0],
    };

    onSubmit(newReport);
    setDmName("");
    setFacebook("");
    setDiscord("");
    setReason("");
    setEvidenceUrl("");
    setSelectedCategories([]);
    onOpenChange(false);
  };

  const isValid = dmName.trim().length > 0 && reason.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground text-xl">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/15 border border-destructive/20">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            แจ้งเตือน DM
          </DialogTitle>
          <DialogDescription>
            กรอกข้อมูลเพื่อรายงาน Dungeon Master ที่มีพฤติกรรมไม่เหมาะสม
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* DM Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="dm-name" className="text-foreground font-medium">
              ชื่อ DM / นามแฝง <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dm-name"
              placeholder="เช่น DarkLord_Kevin"
              value={dmName}
              onChange={(e) => setDmName(e.target.value)}
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>

          {/* Facebook & Discord */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="facebook" className="text-foreground font-medium">
                Facebook{" "}
                <span className="text-muted-foreground font-normal">— ไม่บังคับ</span>
              </Label>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="facebook"
                  placeholder="ชื่อ Facebook"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="pl-9 bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="discord" className="text-foreground font-medium">
                Discord{" "}
                <span className="text-muted-foreground font-normal">— ไม่บังคับ</span>
              </Label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="discord"
                  placeholder="Username#1234"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  className="pl-9 bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-2">
            <Label className="text-foreground font-medium">
              ประเภทพฤติกรรม
            </Label>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => {
                const config = CATEGORY_CONFIG[cat];
                const IconComp = config.icon;
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${isSelected
                      ? `${config.bgColor} border-current/40 ring-1 ring-current/20`
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground bg-secondary/30"
                      }`}
                  >
                    <IconComp className="w-3 h-3" />
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reason */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="reason" className="text-foreground font-medium">
              เหตุผล / รายละเอียดเหตุการณ์{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="อธิบายพฤติกรรมที่ไม่เหมาะสม เช่น Ghosting, Harassment, God Moding..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px] bg-secondary/50 border-border/50 focus:border-primary resize-y"
            />
          </div>

          {/* Evidence */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="evidence-url"
              className="text-foreground font-medium"
            >
              หลักฐาน (URL รูปภาพ){" "}
              <span className="text-muted-foreground font-normal">
                — ไม่บังคับ
              </span>
            </Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="evidence-url"
                type="url"
                placeholder="https://imgur.com/..."
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="pl-9 bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border/50"
            id="cancel-report-btn"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-destructive hover:bg-destructive/90 text-white gap-1.5"
            id="submit-report-btn"
          >
            <AlertTriangle className="w-4 h-4" />
            ส่งรายงาน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Category Filter ─────────────────────────────────────────────────

function CategoryFilter({
  activeFilter,
  onFilterChange,
  reports,
}: {
  activeFilter: CategoryTag | null;
  onFilterChange: (cat: CategoryTag | null) => void;
  reports: BlacklistReport[];
}) {
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<CategoryTag, number>> = {};
    reports.forEach((r) =>
      r.categories.forEach((c) => {
        counts[c] = (counts[c] || 0) + 1;
      })
    );
    return counts;
  }, [reports]);

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onFilterChange(null)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${activeFilter === null
          ? "bg-primary/20 border-primary/40 text-primary"
          : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
          }`}
      >
        ทั้งหมด
        <span className="text-[10px] opacity-60">({reports.length})</span>
      </button>
      {ALL_CATEGORIES.map((cat) => {
        const config = CATEGORY_CONFIG[cat];
        const IconComp = config.icon;
        const count = categoryCounts[cat] || 0;
        if (count === 0) return null;
        return (
          <button
            key={cat}
            onClick={() =>
              onFilterChange(activeFilter === cat ? null : cat)
            }
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${activeFilter === cat
              ? `${config.bgColor} ring-1 ring-current/20`
              : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
          >
            <IconComp className="w-3 h-3" />
            {cat}
            <span className="text-[10px] opacity-60">({count})</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function Home() {
  const [reports, setReports] = useState<BlacklistReport[]>(MOCK_REPORTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryTag | null>(
    null
  );

  const handleSubmitReport = useCallback((newReport: BlacklistReport) => {
    setReports((prev) => [newReport, ...prev]);
  }, []);

  const filteredReports = useMemo(() => {
    let result = reports;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.dmName.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q)
      );
    }

    if (categoryFilter) {
      result = result.filter((r) => r.categories.includes(categoryFilter));
    }

    return result;
  }, [reports, searchQuery, categoryFilter]);

  return (
    <div className="relative min-h-screen">
      <FloatingParticles />

      {/* ── Background gradient blobs ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-destructive/[0.03] blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-arcane/[0.03] blur-[100px]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border/50 glass">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-destructive/20 border border-primary/20 glow-gold">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-destructive animate-pulse-glow" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight shimmer-text">
                  DM Blacklist
                </h1>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                  Tabletop RPG Safety
                </p>
              </div>
            </div>

            {/* Search & Action */}
            <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search-dm"
                  type="search"
                  placeholder="ค้นหา DM ด้วยชื่อ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary/50 border-border/50 focus:border-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <Button
                id="open-report-dialog"
                onClick={() => setDialogOpen(true)}
                className="bg-destructive hover:bg-destructive/90 text-white gap-1.5 shrink-0 shadow-lg shadow-destructive/20 transition-shadow hover:shadow-destructive/30"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">แจ้งเตือน DM</span>
                <span className="sm:hidden">รายงาน</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <section className="text-center mb-10" id="hero-section">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-4">
            <Flame className="w-3 h-3" />
            ปกป้องปาร์ตี้ของคุณจาก DM ที่ไม่เหมาะสม
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
            รายงาน & ค้นหา{" "}
            <span className="shimmer-text">Dungeon Master</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            แพลตฟอร์มสำหรับผู้เล่น Tabletop RPG ในการแจ้งเตือนและค้นหา DM
            ที่มีพฤติกรรมไม่เหมาะสม เพื่อความปลอดภัยของชุมชน TTRPG
          </p>
        </section>

        {/* Stats */}
        <section className="mb-8">
          <StatsBar totalReports={reports.length} />
        </section>

        {/* Category Filters */}
        <section className="mb-8" id="category-filters">
          <CategoryFilter
            activeFilter={categoryFilter}
            onFilterChange={setCategoryFilter}
            reports={reports}
          />
        </section>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ScrollText className="w-4 h-4" />
            <span>
              {filteredReports.length === reports.length
                ? `รายงานทั้งหมด ${reports.length} รายการ`
                : `พบ ${filteredReports.length} จาก ${reports.length} รายการ`}
            </span>
          </div>
          {(searchQuery || categoryFilter) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter(null);
              }}
              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              ล้างตัวกรอง
            </button>
          )}
        </div>

        {/* Blacklist Grid */}
        <section id="blacklist-feed">
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredReports.map((report) => (
                <BlacklistCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/50 border border-border/50 mb-4">
                <Search className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ไม่พบรายงาน
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchQuery
                  ? `ไม่พบ DM ที่ตรงกับ "${searchQuery}"`
                  : "ยังไม่มีรายงานในหมวดหมู่นี้"}
              </p>
            </div>
          )}
        </section>

        {/* Scroll indicator */}
        {filteredReports.length > 4 && (
          <div className="flex justify-center mt-8">
            <ChevronDown className="w-5 h-5 text-muted-foreground/40 animate-bounce" />
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border/30 mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary/60" />
              <span className="text-sm text-muted-foreground">
                DM Blacklist — ปกป้องชุมชน TTRPG
              </span>
            </div>
            <p className="text-xs text-muted-foreground/60">
              สร้างด้วย ❤️ เพื่อผู้เล่น Tabletop RPG ทุกคน
            </p>
          </div>
        </div>
      </footer>

      {/* ── Report Dialog ── */}
      <ReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
}
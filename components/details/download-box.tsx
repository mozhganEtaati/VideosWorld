import { Download, Info, Play, Link2, Share2, AlertTriangle } from "lucide-react";
import { getDownloadBox } from "@/services/mock";

/** Static download box ("باکس دانلود"). Data comes from the mock boundary. */
export function DownloadBox() {
  const box = getDownloadBox();

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-4 flex items-center gap-2">
        <Download className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-bold">باکس دانلود</h2>
      </div>

      {/* info notes */}
      <ul className="mb-4 space-y-2">
        {box.notes.map((note, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{note}</span>
          </li>
        ))}
      </ul>

      {/* dubbing banner */}
      <div className="mb-4 rounded-lg bg-orange-500/90 px-4 py-2 text-center text-sm font-bold text-white">
        {box.banner}
      </div>

      {/* quality rows */}
      <div className="space-y-3">
        {box.rows.map((row, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-border bg-surface-2 p-3 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-4 text-sm">
              <span className="font-bold text-accent">کیفیت : {row.quality}</span>
              <span className="text-muted">
                {row.note ? `توضیحات : ${row.note}` : `انکودر : ${row.encoder}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-black hover:brightness-95"
              >
                <Play className="h-4 w-4" />
                پخش آنلاین
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-black hover:brightness-95"
              >
                <Download className="h-4 w-4" />
                دانلود مستقیم
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* footer actions */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-500"
        >
          <AlertTriangle className="h-4 w-4" />
          گزارش خرابی لینک
        </button>
        <button
          type="button"
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-muted hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
          اشتراک گذاری
        </button>
      </div>
    </section>
  );
}

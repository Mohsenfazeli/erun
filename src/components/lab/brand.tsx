import { cn } from "@/lib/utils";

/** The brand mark, as used in the site header. */
export function ErunMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/brand/erun-mark-160.png"
      alt=""
      width={size}
      height={size}
      className={cn("inline-block shrink-0", className)}
    />
  );
}

/** "Erun Consulting Group." wordmark, as in the site footer. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-extrabold text-foreground", className)}>
      Erun Consulting Group<span className="text-primary">.</span>
    </span>
  );
}

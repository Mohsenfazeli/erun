import { lazy, Suspense, useEffect, useState } from "react";

// The official Cal.com React embed, loaded in the browser only (it needs window).
const Cal = lazy(() => import("@calcom/embed-react"));

/** Splits a Cal.com event link into the embed's calLink and, for other hosts, its origin. */
export function parseBookingUrl(raw: string): { calLink: string; calOrigin?: string } | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const calLink = url.pathname.replace(/^\/+|\/+$/g, "");
    if (url.protocol !== "https:" || !calLink) return null;
    const hosted = url.hostname === "cal.com" || url.hostname === "app.cal.com";
    return hosted ? { calLink } : { calLink, calOrigin: url.origin };
  } catch {
    return null;
  }
}

/**
 * Inline Cal.com booking calendar. Cal.com shows times in the visitor's own time zone,
 * which it reads from the browser.
 */
export function BookingCalendar({ url }: { url: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const target = parseBookingUrl(url);
  if (!target) return null;
  const fallback = <p className="booking-loading">Loading the booking calendar…</p>;
  return (
    <div className="booking-calendar">
      {mounted ? (
        <Suspense fallback={fallback}>
          <Cal
            calLink={target.calLink}
            {...(target.calOrigin
              ? { calOrigin: target.calOrigin, embedJsUrl: `${target.calOrigin}/embed/embed.js` }
              : {})}
            config={{ layout: "month_view", theme: "light" }}
            style={{ width: "100%", height: "100%", overflow: "auto" }}
          />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

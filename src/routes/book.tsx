import { createFileRoute } from "@tanstack/react-router";

import { BookingCalendar, parseBookingUrl } from "@/components/booking-calendar";
import { ContactForm } from "@/components/contact-form";
import { PageShell, SendMessageLink } from "@/components/site-chrome";
import { BOOKING_PATH, BOOKING_URL, pageHead, SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/book")({
  head: () =>
    pageHead({
      title: `Book a Consultation | ${SITE_NAME}`,
      description:
        "Book a short intro call with Erun Consulting Group about economic research, advanced analytics or intelligent reporting.",
      path: BOOKING_PATH,
    }),
  component: BookPage,
});

function BookPage() {
  // Without a valid Cal.com link, show the contact form instead of a broken embed.
  const bookingReady = parseBookingUrl(BOOKING_URL) !== null;
  return (
    <PageShell cta={null}>
      <section className="page-intro booking-intro">
        <div className="eyebrow">
          <span className="small-rule" /> Book a consultation
        </div>
        <h1>
          Book an intro call<span className="text-primary">.</span>
        </h1>
        {bookingReady ? (
          <p>
            Pick a time that suits you. Times are shown in your local time zone.{" "}
            <SendMessageLink label="Prefer to write? Send a message." />
          </p>
        ) : (
          <p>Online booking is coming soon. Send us a message and we’ll find a time.</p>
        )}
      </section>
      {bookingReady ? (
        <section className="booking-section" aria-label="Booking calendar">
          <BookingCalendar url={BOOKING_URL} />
        </section>
      ) : (
        <section
          id="contact"
          className="booking-section booking-fallback"
          aria-label="Contact form"
        >
          <ContactForm returnPath="/book" />
        </section>
      )}
    </PageShell>
  );
}

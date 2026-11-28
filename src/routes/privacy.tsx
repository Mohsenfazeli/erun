import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell } from "@/components/site-chrome";
import { BOOKING_PATH, CONTACT_EMAIL, pageHead, SITE_NAME } from "@/lib/site";

// Every statement here reflects what the website code does. Items marked TODO need a fact
// only the business can supply; replace them before relying on this policy.
const LAST_UPDATED = "November 27, 2026";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      title: `Privacy Policy | ${SITE_NAME}`,
      description:
        "How Erun Consulting Group collects, uses and protects personal information sent through erungroup.ca.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function Todo({ children }: { children: string }) {
  return <mark className="policy-todo">TODO: {children}</mark>;
}

function PrivacyPage() {
  const email = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
  return (
    <PageShell cta={null}>
      <article className="policy">
        <header className="page-intro policy-intro">
          <div className="eyebrow">
            <span className="small-rule" /> Privacy
          </div>
          <h1>
            Privacy Policy<span className="text-primary">.</span>
          </h1>
          <p>Last updated: {LAST_UPDATED}</p>
        </header>

        <section>
          <h2>Who we are</h2>
          <p>
            {SITE_NAME} is a small economics and data consultancy based in Victoria, British
            Columbia. This policy explains what personal information our website, erungroup.ca,
            collects, why, and what we do with it. We follow British Columbia’s Personal Information
            Protection Act (PIPA) and, where it applies, the federal Personal Information Protection
            and Electronic Documents Act (PIPEDA).
          </p>
          <p>
            Questions about privacy go to our privacy contact at {email}.{" "}
            <Todo>name the person responsible for privacy (required under PIPA).</Todo>
          </p>
        </section>

        <section>
          <h2>The contact form</h2>
          <p>
            <strong>What we collect:</strong> your name, your email address and your message.
          </p>
          <p>
            <strong>Why:</strong> only to read your message and reply to you. We do not use it for
            marketing and we do not sell or share it for anyone else’s use.
          </p>
          <p>
            <strong>Where it goes:</strong> when you press “Send message”, the website passes your
            details to Resend, an email delivery service, which sends them to our inbox at{" "}
            {CONTACT_EMAIL}. The website itself does not keep a copy in a database.{" "}
            <Todo>name the provider that hosts the contact@erungroup.ca mailbox.</Todo>
          </p>
          <p>
            <strong>How long we keep it:</strong>{" "}
            <Todo>
              state how long messages are kept in the inbox, and how long Resend keeps its sending
              records for this account.
            </Todo>
          </p>
        </section>

        <section>
          <h2>The booking calendar</h2>
          <p>
            Our <Link to={BOOKING_PATH}>booking page</Link> uses Cal.com, a scheduling service. When
            you book a call, Cal.com collects the details its booking form asks for, such as your
            name, your email address, any notes you add and the time you choose, and uses them to
            confirm the meeting and send reminders. We receive the booking details so we can hold
            the call. Cal.com handles this information under its own privacy policy.
          </p>
          <p>
            <Todo>
              confirm which fields the “Intro call” event asks for, and how long booking details are
              kept in Cal.com and in our calendar.
            </Todo>
          </p>
        </section>

        <section>
          <h2>Lab prototypes</h2>
          <p>
            The prototypes in our Lab use sample data for a fictional company. If you type a
            question into the HR Assistant prototype, the question may be sent to Google’s Gemini AI
            service to write the answer. Please don’t type personal information into it.
          </p>
        </section>

        <section>
          <h2>Hosting, fonts, cookies and analytics</h2>
          <p>
            The website is hosted by Vercel. Like any web host, Vercel processes technical
            information such as your IP address and browser type to deliver pages and keep the site
            secure. The site loads its typeface from Google Fonts, so your browser also contacts
            Google’s servers when a page loads.
          </p>
          <p>
            The website does not use analytics or advertising tools, and it does not set cookies of
            its own. Cal.com may use cookies or similar storage inside the booking calendar to make
            it work.
          </p>
        </section>

        <section>
          <h2>Where information is stored</h2>
          <p>
            The services above (Vercel, Resend, Cal.com and Google) may store or process information
            outside Canada, including in the United States, where it may be subject to local laws.{" "}
            <Todo>confirm the storage regions for each service.</Todo>
          </p>
        </section>

        <section>
          <h2>Your choices and rights</h2>
          <p>
            You can ask to see the personal information we hold about you, ask us to correct it, or
            ask us to delete it. Email {email} and we will respond within 30 days, as PIPA requires.
            You can also withdraw your consent at any time; we will then stop using your information
            except where the law requires us to keep it.
          </p>
          <p>
            If you are not satisfied with our answer, you can contact the Office of the Information
            and Privacy Commissioner for British Columbia.
          </p>
        </section>

        <section>
          <h2>Changes to this policy</h2>
          <p>
            If we change how we handle personal information, we will update this page and the “Last
            updated” date above.
          </p>
        </section>
      </article>
    </PageShell>
  );
}

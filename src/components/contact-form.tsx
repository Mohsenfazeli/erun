import { Link } from "@tanstack/react-router";
import { useEffect, useId, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { sendEnquiry } from "@/lib/contact.functions";
import { CONTACT_EMAIL } from "@/lib/site";

type Status = { kind: "idle" | "sending" | "sent" | "error"; text: string };

const failedText = `Sorry, your message could not be sent. Please email ${CONTACT_EMAIL} instead.`;

/**
 * The contact form. JavaScript sends it with the sendEnquiry server function; without
 * JavaScript the browser posts it to /api/contact, which redirects back with ?message=.
 */
export function ContactForm({ returnPath = "/" }: { returnPath?: "/" | "/book" }) {
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" });
  const id = useId();

  // Outcome of a plain (no-JavaScript) form post, then tidy the URL.
  useEffect(() => {
    const url = new URL(window.location.href);
    const outcome = url.searchParams.get("message");
    if (outcome !== "sent" && outcome !== "failed") return;
    setStatus(
      outcome === "sent"
        ? { kind: "sent", text: "Thank you. Your message has been sent." }
        : { kind: "error", text: failedText },
    );
    url.searchParams.delete("message");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? "");
    setStatus({ kind: "sending", text: "Sending your message…" });
    try {
      const result = await sendEnquiry({
        data: {
          name: field("name"),
          email: field("email"),
          message: field("message"),
          website: field("website"),
        },
      });
      if (result.ok) {
        form.reset();
        setStatus({ kind: "sent", text: "Thank you. Your message has been sent." });
      } else if (result.error === "invalid") {
        setStatus({
          kind: "error",
          text: "Please check your name, a valid email address and your message, then try again.",
        });
      } else {
        setStatus({ kind: "error", text: failedText });
      }
    } catch {
      setStatus({ kind: "error", text: failedText });
    }
  }

  return (
    <form
      method="post"
      action="/api/contact"
      onSubmit={submit}
      className="contact-form"
      aria-describedby={`${id}-required`}
    >
      <input type="hidden" name="return" value={returnPath} />
      <p id={`${id}-required`} className="form-required-note">
        All fields are required.
      </p>
      <label>
        <span>
          Full name{" "}
          <span className="required-mark" aria-hidden="true">
            *
          </span>
        </span>
        <input required name="name" autoComplete="name" placeholder="Alex Morgan" />
      </label>
      <label>
        <span>
          Email address{" "}
          <span className="required-mark" aria-hidden="true">
            *
          </span>
        </span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          placeholder="alex@company.com"
        />
      </label>
      <label>
        <span>
          How can we help?{" "}
          <span className="required-mark" aria-hidden="true">
            *
          </span>
        </span>
        <textarea
          required
          name="message"
          rows={3}
          placeholder="Tell us about your project or objectives…"
        />
      </label>
      {/* Honeypot: invisible to people and screen readers, often filled by bots. */}
      <div className="form-trap" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        </label>
      </div>
      <Button
        variant="default"
        type="submit"
        className="enquiry-button"
        disabled={status.kind === "sending"}
      >
        Send message <ArrowUpRight />
      </Button>
      {/* Live regions stay in the page so changes are announced: errors at once (alert),
          progress and success politely (status). */}
      <p className="form-note form-error" role="alert">
        {status.kind === "error" ? status.text : ""}
      </p>
      <p className="form-note" role="status">
        {status.kind === "sending" || status.kind === "sent" ? status.text : ""}
      </p>
      {status.kind === "idle" && (
        <p className="form-note">
          Prefer email? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      )}
      <p className="form-note form-privacy">
        We use your details only to reply to your message. See our{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </form>
  );
}

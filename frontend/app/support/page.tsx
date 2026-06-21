"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { ChevronDown, ChevronUp, Mail, MessageCircle } from "lucide-react";

const SUPPORT_EMAIL = "support@interviewexplainer.com";

const FAQ_ITEMS = [
  {
    q: "Is InterviewExplainer free to use?",
    a: "Yes — all Q&A content is completely free to browse with no account required. Creating an account unlocks progress tracking, bookmarks, and personalised recommendations.",
  },
  {
    q: "How do I track my progress?",
    a: "Sign up for a free account and use the 'Mark as Practiced' button on any question page. Your progress and streaks are automatically saved and shown on your dashboard.",
  },
  {
    q: "What topics are covered?",
    a: "We currently cover Java (Spring Boot, Core Java, Microservices), System Design, and SQL — with content aimed at 0–2 year, 3–5 year, and 5+ year experience levels. More domains are being added regularly.",
  },
  {
    q: "I forgot my password. How do I reset it?",
    a: "Click 'Forgot password?' on the login page and enter your registered email address. You will receive a reset link within a few minutes. Check your spam folder if it does not arrive.",
  },
  {
    q: "How do I delete my account?",
    a: `Send an email to ${SUPPORT_EMAIL} with the subject line 'Delete my account'. We will permanently delete your data within 7 business days.`,
  },
  {
    q: "How do I report an error in a question or answer?",
    a: `Use the contact form below or email ${SUPPORT_EMAIL} with the URL of the page, a description of the issue, and — if possible — the correct information.`,
  },
  {
    q: "Can I suggest a topic or domain to add?",
    a: `Absolutely. We welcome content suggestions. Email us or use the form below with 'Content suggestion' as the subject.`,
  },
  {
    q: "Is there a mobile app?",
    a: "Not yet. The website is fully responsive and works well on mobile browsers. A dedicated mobile app is on our roadmap.",
  },
];

export default function SupportPage() {
  return (
    <main className="w-full min-w-0 px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-3">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions, or reach out and we will get back to you.
        </p>
      </div>

      <section className="mb-14">
        <h2 className="text-xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-2">Still need help?</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Fill in the form below and we will respond within 1–2 business days.
        </p>
        <ContactForm />
      </section>
    </main>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-background">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
        aria-expanded={open}
      >
        <span>{question}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 ml-4" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-4" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{answer}</div>
      )}
    </div>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // mailto fallback — replace with API call when email provider is configured
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
        <MessageCircle className="w-10 h-10 text-primary mx-auto mb-3" />
        <h3 className="font-semibold text-foreground mb-1">Message sent</h3>
        <p className="text-sm text-muted-foreground">
          Your default mail app should have opened. We will respond within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Name" required>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="input-field"
          />
        </FormField>
        <FormField label="Email" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="input-field"
          />
        </FormField>
      </div>
      <FormField label="Subject" required>
        <input
          type="text"
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="e.g. Bug report, Content suggestion, Billing"
          className="input-field"
        />
      </FormField>
      <FormField label="Message" required>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Describe your issue or suggestion in detail..."
          className="input-field resize-none"
        />
      </FormField>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Send Message
        </button>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Mail className="w-4 h-4" />
          {SUPPORT_EMAIL}
        </a>
      </div>
    </form>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

import type { Metadata } from "next";
import { getCanonicalOrigin } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "Terms of Service | InterviewExplainer",
  description: "The terms and conditions governing your use of InterviewExplainer.",
  alternates: { canonical: `${getCanonicalOrigin()}/terms` },
};

const EFFECTIVE_DATE = "January 1, 2025";
const CONTACT_EMAIL = "legal@interviewexplainer.com";

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">Effective date: {EFFECTIVE_DATE}</p>

      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using InterviewExplainer (&ldquo;Service&rdquo;), you agree to be bound by
          these Terms of Service. If you do not agree to these terms, do not use the Service.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          InterviewExplainer provides structured interview preparation content including questions,
          answers, learning paths, and progress tracking tools. Content is provided for educational
          purposes only.
        </p>
      </Section>

      <Section title="3. User Accounts">
        <ul className="list-disc pl-5 space-y-1">
          <li>You must be at least 13 years of age to create an account.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You are responsible for all activity that occurs under your account.</li>
          <li>You must provide accurate and truthful information when registering.</li>
        </ul>
      </Section>

      <Section title="4. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Scrape, copy, or redistribute our content without written permission.</li>
          <li>Use automated tools to access the Service at scale.</li>
          <li>Attempt to gain unauthorised access to any part of the Service.</li>
          <li>Use the Service to engage in any unlawful activity.</li>
        </ul>
      </Section>

      <Section title="5. Intellectual Property">
        <p>
          All content on InterviewExplainer — including text, code examples, diagrams, and learning
          paths — is the intellectual property of InterviewExplainer or its content contributors.
          Personal use for interview preparation is permitted. Republication or commercial use
          requires explicit written consent.
        </p>
      </Section>

      <Section title="6. Disclaimer of Warranties">
        <p>
          The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express or
          implied. We do not guarantee that content is error-free, complete, or suitable for any
          specific purpose. Interview preparation content does not guarantee employment outcomes.
        </p>
      </Section>

      <Section title="7. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, InterviewExplainer shall not be liable for any
          indirect, incidental, special, or consequential damages arising from your use of the
          Service.
        </p>
      </Section>

      <Section title="8. Termination">
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms. You may
          close your account at any time by contacting us.
        </p>
      </Section>

      <Section title="9. Changes to Terms">
        <p>
          We may modify these Terms at any time. Continued use of the Service after changes
          constitutes acceptance of the new terms.
        </p>
      </Section>

      <Section title="10. Governing Law">
        <p>
          These Terms are governed by the laws of the jurisdiction in which InterviewExplainer
          operates, without regard to conflict of law principles.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          For legal enquiries, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">{CONTACT_EMAIL}</a>.
        </p>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

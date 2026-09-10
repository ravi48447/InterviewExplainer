import type { Metadata } from "next";
import { getCanonicalOrigin } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "Privacy Policy | InterviewExplainer",
  description: "Learn how InterviewExplainer collects, uses, and protects your personal data.",
  alternates: { canonical: `${getCanonicalOrigin()}/privacy` },
};

const EFFECTIVE_DATE = "January 1, 2025";
const COMPANY_NAME = "InterviewExplainer";
const CONTACT_EMAIL = "privacy@interviewexplainer.com";

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Effective date: {EFFECTIVE_DATE}</p>

      <Section title="1. Who We Are">
        <p>
          {COMPANY_NAME} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates the website
          interviewexplainer.com. This Privacy Policy explains how we collect, use, disclose, and safeguard
          your personal information when you visit our website.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Account information</strong> — name and email address when you create an account.
          </li>
          <li>
            <strong>Usage data</strong> — pages visited, questions viewed, progress and bookmarks saved
            during a session.
          </li>
          <li>
            <strong>Device &amp; log data</strong> — IP address, browser type, operating system, and
            referring URLs collected automatically by our servers.
          </li>
          <li>
            <strong>Cookies &amp; similar technologies</strong> — see our{" "}
            <a href="/cookies" className="text-primary underline">Cookie Policy</a>.
          </li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To create and manage your account and learning progress.</li>
          <li>To personalise the content and recommendations shown to you.</li>
          <li>To send transactional emails (e.g. account verification, password reset).</li>
          <li>To analyse usage patterns and improve the platform.</li>
          <li>To detect and prevent fraud, abuse, or security incidents.</li>
        </ul>
      </Section>

      <Section title="4. Legal Basis for Processing (EEA / UK users)">
        <p>
          Where applicable, we process your data on the basis of your consent (newsletter sign-ups),
          the performance of a contract (account services), or our legitimate interest in operating
          and improving the platform.
        </p>
      </Section>

      <Section title="5. Data Sharing">
        <p>
          We do not sell your personal data. We share data only with trusted service providers
          (hosting, analytics, email delivery) under confidentiality agreements, or when required by
          law.
        </p>
      </Section>

      <Section title="6. Data Retention">
        <p>
          We retain account data for as long as your account is active. You may delete your account
          at any time by contacting us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">{CONTACT_EMAIL}</a>.
          Usage logs are retained for up to 12 months.
        </p>
      </Section>

      <Section title="7. Your Rights">
        <p>
          Depending on your location you may have the right to access, correct, delete, or port your
          personal data, and to object to or restrict certain processing. To exercise any of these
          rights, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">{CONTACT_EMAIL}</a>.
        </p>
      </Section>

      <Section title="8. Security">
        <p>
          We implement industry-standard technical and organisational measures to protect your data.
          No method of transmission over the internet is 100% secure; we encourage you to use a
          strong, unique password.
        </p>
      </Section>

      <Section title="9. Children's Privacy">
        <p>
          Our service is not directed to children under 13. We do not knowingly collect personal
          information from children. If you believe a child has provided us with personal data, please
          contact us immediately.
        </p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>
          We may update this policy from time to time. We will notify you of material changes by
          posting the new policy on this page with an updated effective date.
        </p>
      </Section>

      <Section title="11. Contact Us">
        <p>
          Questions or concerns about this policy? Reach us at{" "}
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

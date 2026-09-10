import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | InterviewExplainer",
  description: "How InterviewExplainer uses cookies and similar tracking technologies.",
};

const EFFECTIVE_DATE = "January 1, 2025";
const CONTACT_EMAIL = "privacy@interviewexplainer.com";

export default function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-2">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Effective date: {EFFECTIVE_DATE}</p>

      <Section title="1. What Are Cookies?">
        <p>
          Cookies are small text files placed on your device when you visit a website. They help us
          recognise your browser across visits and store preferences so you do not need to set them
          again each time you return.
        </p>
      </Section>

      <Section title="2. How We Use Cookies">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse mt-2">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-semibold text-foreground">Category</th>
                <th className="text-left py-2 pr-4 font-semibold text-foreground">Purpose</th>
                <th className="text-left py-2 font-semibold text-foreground">Can be disabled?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <CookieRow
                category="Essential"
                purpose="Session management, authentication token storage, and security."
                canDisable="No — required for the service to function."
              />
              <CookieRow
                category="Functional"
                purpose="Remembering your theme preference (light/dark) and last-viewed domain."
                canDisable="Yes — disabling may affect user experience."
              />
              <CookieRow
                category="Analytics"
                purpose="Aggregate, anonymised usage statistics (via Plausible Analytics — no personal data collected)."
                canDisable="Yes — opt out via browser settings or a Do Not Track header."
              />
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="3. Third-Party Cookies">
        <p>
          We use <strong>Plausible Analytics</strong>, a privacy-first analytics tool that does not
          use cookies and does not collect personal data or cross-site identifiers. No third-party
          advertising or tracking cookies are set on this site.
        </p>
      </Section>

      <Section title="4. Managing Cookies">
        <p>
          You can control cookies through your browser settings. Note that disabling essential
          cookies will prevent you from logging in. For guidance on managing cookies in popular
          browsers:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Chrome</a>
          </li>
          <li>
            <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary underline">Mozilla Firefox</a>
          </li>
          <li>
            <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary underline">Apple Safari</a>
          </li>
        </ul>
      </Section>

      <Section title="5. Changes to This Policy">
        <p>
          We may update this Cookie Policy from time to time. We will notify you by posting the
          updated policy on this page with a new effective date.
        </p>
      </Section>

      <Section title="6. Contact">
        <p>
          Questions about our use of cookies? Contact us at{" "}
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

function CookieRow({
  category,
  purpose,
  canDisable,
}: {
  category: string;
  purpose: string;
  canDisable: string;
}) {
  return (
    <tr>
      <td className="py-2 pr-4 font-medium text-foreground align-top">{category}</td>
      <td className="py-2 pr-4 align-top">{purpose}</td>
      <td className="py-2 align-top">{canDisable}</td>
    </tr>
  );
}

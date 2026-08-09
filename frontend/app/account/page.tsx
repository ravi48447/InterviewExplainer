/**
 * app/account/page.tsx — Canonical account route (P08-WF, T241..T280).
 *
 * Server shell rendering the client AccountShell (account variant).
 * Metadata is static (the page is personalized client-side).
 */

import { AccountShell } from "@/components/user-v2";
import { buildAccountMetadata } from "@/lib/user";

export const metadata = buildAccountMetadata();

export default function AccountPage() {
  return <AccountShell variant="account" defaultTab="settings" />;
}

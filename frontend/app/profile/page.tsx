/**
 * app/profile/page.tsx — Canonical profile route (P08-WF, T281..T300).
 *
 * Read-only identity + bookmarks view. Server shell rendering the client
 * AccountShell (profile variant).
 */

import { AccountShell } from "@/components/user-v2";
import { buildProfileMetadata } from "@/lib/user";

export const metadata = buildProfileMetadata();

export default function ProfilePage() {
  return <AccountShell variant="profile" defaultTab="bookmarks" />;
}

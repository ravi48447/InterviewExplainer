/**
 * reset-token-reader.tsx — Client bridge that reads the `token` search param
 * and forwards it to PasswordResetForm. Keeps /reset-password a server shell.
 * (P08-WB, T106..T120)
 */

"use client";

import { useSearchParams } from "next/navigation";
import { PasswordResetForm } from "./password-reset-form";

export function ResetTokenReader() {
  const token = useSearchParams().get("token") ?? undefined;
  return <PasswordResetForm mode="reset" token={token} />;
}

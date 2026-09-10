import { ReactNode } from "react";
import { DSALangProvider } from "@/components/dsa/DSALangContext";

/**
 * Section-level layout for /dsa/*.
 *
 * Wraps every DSA page in the language context so the Java/Python toggle on
 * any code block — including line-by-line walkthroughs — persists across
 * navigations and reloads (localStorage-backed).
 */
export default function DSALayout({ children }: { children: ReactNode }) {
  return <DSALangProvider>{children}</DSALangProvider>;
}

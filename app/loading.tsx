import { ShellLoading } from "@/components/shell/shell-loading";

/**
 * Root loading (P03-T217..T227).
 * Layout-preserving skeleton inside the shell; the header/footer stay mounted
 * because only the page segment is loading. No full-screen spinner (T222).
 */
export default function Loading() {
  return <ShellLoading />;
}

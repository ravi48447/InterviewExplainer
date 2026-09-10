'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy route — the feature moved to the Mock Hub. Redirect there. */
export default function Redirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/mock-interviews${window.location.search}`);
  }, [router]);
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Redirecting to the Mock Hub…</p>
    </div>
  );
}

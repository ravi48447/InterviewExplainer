'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy route — the feature moved to the Mock Hub. Redirect there. */
export default function Redirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/mock-interviews'); }, [router]);
  return (
    <div className="min-h-screen bg-[#121110] text-[#f5f1e8] flex items-center justify-center">
      <p className="text-stone-500 text-sm">Redirecting to the Mock Hub…</p>
    </div>
  );
}

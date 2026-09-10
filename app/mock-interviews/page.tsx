import { Suspense } from 'react';
import { MockInterviewStudio } from '@/components/mock-interviews/MockInterviewStudio';

function StudioLoading() {
  return (
    <div className="min-h-screen bg-studio-canvas px-4 py-6 text-foreground" aria-busy="true">
      <div className="mx-auto w-full max-w-[1520px] animate-pulse">
        <div className="h-9 w-80 rounded-md bg-muted" />
        <div className="mt-3 h-5 max-w-3xl rounded bg-muted" />
        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(20rem,1fr)_minmax(29rem,34rem)_minmax(20rem,1fr)]">
          <div className="h-[36rem] rounded-xl border border-border bg-surface" />
          <div className="h-[36rem] rounded-xl bg-studio" />
          <div className="h-[36rem] rounded-xl border border-border bg-surface lg:col-span-2 xl:col-span-1" />
        </div>
      </div>
    </div>
  );
}

export default function MockInterviewPage() {
  return (
    <Suspense fallback={<StudioLoading />}>
      <MockInterviewStudio />
    </Suspense>
  );
}

import { PageContainer } from "@/components/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function DomainsLoading() {
  return (
    <main className="min-h-screen bg-background" aria-label="Loading Domain Explorer">
      <section className="border-b border-border bg-[#fffdfb] py-12 sm:py-16">
        <PageContainer>
          <div className="grid items-center gap-10 xl:grid-cols-[0.88fr_1.12fr] xl:gap-12">
            <div>
              <Skeleton className="h-7 w-56 rounded-full" />
              <Skeleton className="mt-5 h-14 w-full max-w-[540px] rounded-xl" />
              <Skeleton className="mt-3 h-14 w-full max-w-[490px] rounded-xl" />
              <Skeleton className="mt-6 h-16 w-full max-w-[520px] rounded-xl" />
              <Skeleton className="mt-7 h-11 w-44 rounded-lg" />
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-2.5">
                {[0, 1, 2].map((item) => <Skeleton key={item} className="h-[68px] rounded-xl" />)}
              </div>
            </div>
            <Skeleton className="h-[330px] rounded-2xl sm:h-[390px]" />
          </div>
        </PageContainer>
      </section>
      <PageContainer className="py-12">
        <Skeleton className="h-9 w-72 rounded-lg" />
        <Skeleton className="mt-7 h-32 rounded-2xl" />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className="h-[238px] rounded-2xl" />)}
        </div>
      </PageContainer>
    </main>
  );
}

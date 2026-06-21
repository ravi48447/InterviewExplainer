import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({ children, className, noPadding = false }: PageContainerProps) {
  return (
    <div className={cn(
      "w-full min-w-0 max-w-none",
      !noPadding && "px-4 sm:px-6 lg:px-8 xl:px-10",
      className
    )}>
      {children}
    </div>
  );
}
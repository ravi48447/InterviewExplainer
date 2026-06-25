import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  className,
  icon,
  title,
  description,
  actionText,
  onAction,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-border bg-surface/30 min-h-[300px]",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 [&_svg]:size-6">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="default" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}

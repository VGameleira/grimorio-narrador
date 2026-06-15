import { cn } from "@/lib/utils";
import type * as React from "react";
type PageHeaderProps = {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};
export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-8", className)}>
      {" "}
      <div>
        {" "}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>{" "}
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}{" "}
      </div>{" "}
      {action && <div className="flex items-center gap-2">{action}</div>}{" "}
    </div>
  );
}

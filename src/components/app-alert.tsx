import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AppAlert({
  action,
  children,
  className = "",
}: {
  action: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Alert className={className} variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{children}</AlertTitle>
      <AlertDescription className="flex justify-end">{action}</AlertDescription>
    </Alert>
  );
}

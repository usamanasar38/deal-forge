import { useWalletUi } from "@wallet-ui/react";
import { type GetExplorerLinkArgs, getExplorerLink } from "gill";
import type { ReactNode } from "react";
import { AppAlert } from "@/components/app-alert";
import { Button } from "@/components/ui/button";
import { useClusterVersion } from "./use-cluster-version";

export function ExplorerLink({
  className,
  label = "",
  ...link
}: GetExplorerLinkArgs & {
  className?: string;
  label: string;
}) {
  const { cluster } = useWalletUi();
  return (
    <a
      className={className ? className : "link font-mono"}
      href={getExplorerLink({ ...link, cluster: cluster.cluster })}
      rel="noopener noreferrer"
      target="_blank"
    >
      {label}
    </a>
  );
}

export function ClusterChecker({ children }: { children: ReactNode }) {
  const { cluster } = useWalletUi();
  const query = useClusterVersion();

  if (query.isLoading) {
    return null;
  }

  if (query.isError || !query.data) {
    return (
      <AppAlert
        action={
          <Button onClick={() => query.refetch()} variant="outline">
            Refresh
          </Button>
        }
        className="mb-4"
      >
        Error connecting to cluster{" "}
        <span className="font-bold">{cluster.label}</span>.
      </AppAlert>
    );
  }
  return children;
}

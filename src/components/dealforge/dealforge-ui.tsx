import { ellipsify } from "@wallet-ui/react";
import { ExplorerLink } from "@/components/cluster/cluster-ui";
import { Button } from "@/components/ui/button";
import {
  useDealforgeProgramId,
  useGetProgramAccountQuery,
  useGreetMutation,
} from "./dealforge-data-access";

export function DealforgeProgramExplorerLink() {
  const programId = useDealforgeProgramId();

  return (
    <ExplorerLink
      address={programId.toString()}
      label={ellipsify(programId.toString())}
    />
  );
}

export function DealforgeCreate() {
  const greetMutation = useGreetMutation();

  return (
    <Button
      disabled={greetMutation.isPending}
      onClick={() => greetMutation.mutateAsync()}
    >
      Run program{greetMutation.isPending && "..."}
    </Button>
  );
}

export function DealforgeProgram() {
  const query = useGetProgramAccountQuery();

  if (query.isLoading) {
    return <span className="loading loading-spinner loading-lg" />;
  }
  if (!query.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={"space-y-6"}>
      <pre>{JSON.stringify(query.data.value.data, null, 2)}</pre>
    </div>
  );
}

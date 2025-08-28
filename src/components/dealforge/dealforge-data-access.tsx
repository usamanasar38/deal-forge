import { getDealforgeProgramId, getGreetInstruction } from "@project/anchor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useWalletUi } from "@wallet-ui/react";
import { useMemo } from "react";
import { toast } from "sonner";
import { useWalletTransactionSignAndSend } from "@/components/solana/use-wallet-transaction-sign-and-send";
import { useWalletUiSigner } from "@/components/solana/use-wallet-ui-signer";
import { toastTx } from "@/components/toast-tx";

export function useDealforgeProgramId() {
  const { cluster } = useWalletUi();

  return useMemo(() => getDealforgeProgramId(cluster.id), [cluster]);
}

export function useGetProgramAccountQuery() {
  const { client, cluster } = useWalletUi();

  return useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () =>
      client.rpc.getAccountInfo(getDealforgeProgramId(cluster.id)).send(),
  });
}

export function useGreetMutation() {
  const programAddress = useDealforgeProgramId();
  const txSigner = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(
        getGreetInstruction({ programAddress }),
        txSigner
      );
    },
    onSuccess: (signature) => {
      toastTx(signature);
    },
    onError: () => toast.error("Failed to run program"),
  });
}

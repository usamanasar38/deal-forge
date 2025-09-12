import {
  fetchOffer,
  getDealforgeProgramId,
  getMakeOfferInstructionAsync,
  getRefundOfferInstructionAsync,
  getTakeOfferInstructionAsync,
  SEEDS,
} from "@project/anchor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type SolanaCluster, useWalletUi } from "@wallet-ui/react";
import {
  type Address,
  getAddressEncoder,
  getBytesEncoder,
  getProgramDerivedAddress,
  getU64Encoder,
  getUtf8Encoder,
  type ProgramDerivedAddress,
} from "gill";
import {
  getAssociatedTokenAccountAddress,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "gill/programs";
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

// Utility functions for PDA derivation
export function getOfferPDA({
  cluster,
  maker,
  offerId,
}: {
  cluster: SolanaCluster;
  maker: Address;
  offerId: bigint;
}): Promise<ProgramDerivedAddress> {
  return getProgramDerivedAddress({
    programAddress: getDealforgeProgramId(cluster.id), // This should be dynamic based on cluster
    seeds: [
      getBytesEncoder().encode(getUtf8Encoder().encode(SEEDS.OFFER_SEED)),
      getAddressEncoder().encode(maker),
      getU64Encoder().encode(offerId),
    ],
  });
}

export function getVaultAddress(
  tokenMint: Address,
  offer: Address
): Promise<Address> {
  return getAssociatedTokenAccountAddress(
    tokenMint,
    offer,
    TOKEN_2022_PROGRAM_ADDRESS
  );
}

// Hook to fetch a specific offer
export function useOfferQuery(maker: Address | null, offerId: bigint | null) {
  const { client, cluster } = useWalletUi();

  return useQuery({
    queryKey: ["offer", maker?.toString(), offerId?.toString()],
    queryFn: async () => {
      if (!maker || offerId === null) return null;
      const [offerAddress] = await getOfferPDA({ cluster, maker, offerId });
      return fetchOffer(client.rpc, offerAddress);
    },
    enabled: !!maker && offerId !== null,
  });
}

// Hook for making offers
export function useMakeOfferMutation() {
  const { cluster } = useWalletUi();
  const txSigner = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();

  return useMutation({
    mutationFn: async ({
      offerId,
      offeredMint,
      requestedMint,
      offeredAmount,
      requestedAmount,
    }: {
      offerId: bigint;
      offeredMint: Address;
      requestedMint: Address;
      offeredAmount: bigint;
      requestedAmount: bigint;
    }) => {
      if (!txSigner) throw new Error("Wallet not connected");

      const [offer] = await getOfferPDA({
        cluster,
        maker: txSigner.address,
        offerId,
      });
      const vault = await getVaultAddress(offeredMint, offer);
      const makerOfferedAta = await getAssociatedTokenAccountAddress(
        offeredMint,
        txSigner.address,
        TOKEN_2022_PROGRAM_ADDRESS
      );

      const instruction = await getMakeOfferInstructionAsync({
        id: offerId,
        maker: txSigner,
        offeredMint,
        requestedMint,
        makerOfferedAta,
        offer,
        vault,
        offeredAmount,
        requestedAmount,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      });

      return await signAndSend(instruction, txSigner);
    },
    onSuccess: (signature) => {
      toast.success("Offer created successfully!");
      toastTx(signature);
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to create offer";
      toast.error(message);
    },
  });
}

// Hook for taking offers
export function useTakeOfferMutation() {
  const { cluster } = useWalletUi();
  const txSigner = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();

  return useMutation({
    mutationFn: async ({
      maker,
      offerId,
      offeredMint,
      requestedMint,
    }: {
      maker: Address;
      offerId: bigint;
      offeredMint: Address;
      requestedMint: Address;
    }) => {
      if (!txSigner) throw new Error("Wallet not connected");

      const [offer] = await getOfferPDA({ cluster, maker, offerId });
      const vault = await getVaultAddress(offeredMint, offer);

      const makerRequestedAta = await getAssociatedTokenAccountAddress(
        requestedMint,
        maker,
        TOKEN_2022_PROGRAM_ADDRESS
      );
      const takerOfferedAta = await getAssociatedTokenAccountAddress(
        requestedMint,
        txSigner.address,
        TOKEN_2022_PROGRAM_ADDRESS
      );
      const takerRequestedAta = await getAssociatedTokenAccountAddress(
        offeredMint,
        txSigner.address,
        TOKEN_2022_PROGRAM_ADDRESS
      );

      const instruction = await getTakeOfferInstructionAsync({
        maker,
        taker: txSigner,
        offeredMint,
        requestedMint,
        makerRequestedAta,
        takerOfferedAta,
        takerRequestedAta,
        offer,
        vault,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      });

      return await signAndSend(instruction, txSigner);
    },
    onSuccess: (signature) => {
      toast.success("Offer taken successfully!");
      toastTx(signature);
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to take offer";
      toast.error(message);
    },
  });
}

// Hook for refunding offers
export function useRefundOfferMutation() {
  const { cluster } = useWalletUi();
  const txSigner = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();

  return useMutation({
    mutationFn: async ({
      offerId,
      offeredMint,
    }: {
      offerId: bigint;
      offeredMint: Address;
    }) => {
      if (!txSigner) throw new Error("Wallet not connected");

      const [offer] = await getOfferPDA({
        cluster,
        maker: txSigner.address,
        offerId,
      });
      const vault = await getVaultAddress(offeredMint, offer);
      const makerOfferedAta = await getAssociatedTokenAccountAddress(
        offeredMint,
        txSigner.address,
        TOKEN_2022_PROGRAM_ADDRESS
      );

      const instruction = await getRefundOfferInstructionAsync({
        maker: txSigner,
        offeredMint,
        makerOfferedAta,
        offer,
        vault,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      });

      return await signAndSend(instruction, txSigner);
    },
    onSuccess: (signature) => {
      toast.success("Offer refunded successfully!");
      toastTx(signature);
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to refund offer";
      toast.error(message);
    },
  });
}

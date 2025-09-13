import {
  fetchAllOffer,
  fetchOffer,
  getDealforgeProgramId,
  getMakeOfferInstructionAsync,
  getRefundOfferInstructionAsync,
  getTakeOfferInstructionAsync,
  OFFER_DISCRIMINATOR,
  type Offer,
  SEEDS,
} from "@project/anchor";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { type SolanaCluster, useWalletUi } from "@wallet-ui/react";
import {
  type Account,
  type Address,
  getAddressEncoder,
  getBytesEncoder,
  getProgramDerivedAddress,
  getU64Encoder,
  getUtf8Encoder,
  type ProgramDerivedAddress,
  type Rpc,
  type SolanaRpcApi,
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

export async function fetchOffersPage(
  rpc: Rpc<SolanaRpcApi>,
  programId: Address,
  limit = 10,
  before?: Address
) {
  // Fetch raw accounts with discriminator filter
  const accounts = await rpc
    .getProgramAccounts(programId, {
      filters: [
        {
          memcmp: {
            offset: 0n,
            bytes: Array.from(OFFER_DISCRIMINATOR),
          },
        },
      ],
      limit,
      before,
    })
    .send();

  // Extract pubkeys
  const pubkeys = (accounts as unknown as { pubkey: Address }[]).map(
    (account) => account.pubkey
  );

  // Decode with Gill SDK
  const decoded = await fetchAllOffer(rpc, pubkeys);

  return decoded.map((offer, i) => ({
    pubkey: pubkeys[i],
    account: offer,
  }));
}

const PAGE_SIZE = 20;

export function useOffersPaginated() {
  const { client, cluster } = useWalletUi();
  const programId = useDealforgeProgramId();

  return useInfiniteQuery({
    queryKey: ["all-offers", { cluster: cluster.id }],
    queryFn: async ({ pageParam }) => {
      // pageParam is the "before" cursor
      const results = await fetchOffersPage(
        client.rpc,
        programId,
        PAGE_SIZE,
        pageParam
      );
      return results;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.length) return;
      // last pubkey is the cursor
      return lastPage.at(-1)?.pubkey;
    },
    initialPageParam: undefined as Address | undefined,
  });
}

// Hook to fetch a specific offer
export function useOfferQuery(maker: Address | null, offerId: bigint | null) {
  const { client, cluster } = useWalletUi();

  return useQuery({
    queryKey: ["offer", { maker, offerId }, { cluster: cluster.id }],
    queryFn: async () => {
      if (!maker || offerId === null) return null;
      const [offerAddress] = await getOfferPDA({ cluster, maker, offerId });
      return fetchOffer(client.rpc, offerAddress);
    },
    enabled: !!maker && offerId !== null,
  });
}

// Hook to make an offer
export function useMakeOfferMutation() {
  const txSigner = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();
  const queryClient = useQueryClient();
  const { cluster } = useWalletUi();

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
      if (!txSigner.address) {
        throw new Error("Wallet not connected");
      }

      const instruction = await getMakeOfferInstructionAsync({
        id: offerId,
        offeredMint,
        offeredAmount,
        requestedMint,
        requestedAmount,
        maker: txSigner,
      });

      return await signAndSend(instruction, txSigner);
    },
    onSuccess: (signature) => {
      toast.success("Offer created successfully!");
      toastTx(signature);
      // Invalidate and refetch offers query
      queryClient.invalidateQueries({
        queryKey: ["all-offers", { cluster: cluster.id }],
      });
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
  const txSigner = useWalletUiSigner();
  const signAndSend = useWalletTransactionSignAndSend();

  return useMutation({
    mutationFn: async ({
      offer,
      offeredMint,
      requestedMint,
    }: {
      offer: Account<Offer, string>;
      offeredMint: Address;
      requestedMint: Address;
    }) => {
      if (!txSigner) throw new Error("Wallet not connected");

      // const [offerPda] = await getOfferPDA({
      //   cluster,
      //   maker: offer.data.maker,
      //   offerId: offer.data.id,
      // });

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
        maker: offer.data.maker,
        taker: txSigner,
        offeredMint: offer.data.offeredMint,
        requestedMint: offer.data.requestedMint,
        takerOfferedAta,
        takerRequestedAta,
        offer: offer.address,
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

      const instruction = await getRefundOfferInstructionAsync({
        maker: txSigner,
        offeredMint,
        offer,
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

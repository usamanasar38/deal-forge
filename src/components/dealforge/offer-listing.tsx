"use client";

import { OFFER_DISCRIMINATOR, type Offer } from "@project/anchor";
import { ellipsify, useWalletUi } from "@wallet-ui/react";
import type { Account, Address, Base64EncodedBytes } from "gill";
import { useMemo, useState } from "react";
import { ExplorerLink } from "@/components/cluster/cluster-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  useDealforgeProgramId,
  useOffersPaginated,
  useProgramAccounts,
  useRefundOfferMutation,
  useTakeOfferMutation,
} from "./dealforge-data-access";

interface OfferDetailsProps {
  readonly offer: { pubkey: Address; account: Account<Offer> };
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

function OfferDetails({ offer, open, onOpenChange }: OfferDetailsProps) {
  const { account } = useWalletUi();
  const takeOfferMutation = useTakeOfferMutation();
  const refundOfferMutation = useRefundOfferMutation();

  const isOwner = account?.address === offer.account.data.maker;
  const offerId = offer.account.data.id;

  const formatAmount = (amount: bigint) => {
    const DECIMALS = 1_000_000_000n;
    return (Number(amount) / Number(DECIMALS)).toFixed(9);
  };

  const handleTakeOffer = async () => {
    await takeOfferMutation.mutateAsync({
      offer: offer.account,
      offeredMint: offer.account.data.offeredMint,
      requestedMint: offer.account.data.requestedMint,
    });
    onOpenChange(false);
  };

  const handleRefundOffer = async () => {
    await refundOfferMutation.mutateAsync({
      offerId,
      offeredMint: offer.account.data.offeredMint,
    });
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="max-w-2xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Offer Details</DialogTitle>
              <DialogDescription>
                Offer ID: {offerId.toString()}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {isOwner && <Badge variant="secondary">Your Offer</Badge>}
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Offered Token */}
            <div className="space-y-2">
              <h3 className="font-semibold text-green-600">Offering</h3>
              <div className="space-y-1">
                <div className="font-bold text-2xl">
                  {formatAmount(offer.account.data.offeredAmount)}
                </div>
                <div className="text-gray-500 text-sm">
                  <ExplorerLink
                    address={offer.account.data.offeredMint.toString()}
                    label={ellipsify(offer.account.data.offeredMint.toString())}
                  />
                </div>
              </div>
            </div>

            {/* Requested Token */}
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-600">Requesting</h3>
              <div className="space-y-1">
                <div className="font-bold text-2xl">
                  {formatAmount(offer.account.data.requestedAmount)}
                </div>
                <div className="text-gray-500 text-sm">
                  <ExplorerLink
                    address={offer.account.data.requestedMint.toString()}
                    label={ellipsify(
                      offer.account.data.requestedMint.toString()
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Maker Information */}
          <div className="space-y-2">
            <h3 className="font-semibold">Maker</h3>
            <ExplorerLink
              address={offer.account.data.maker.toString()}
              label={ellipsify(offer.account.data.maker.toString())}
            />
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            {isOwner ? (
              <Button
                disabled={refundOfferMutation.isPending}
                onClick={handleRefundOffer}
                variant="destructive"
              >
                {refundOfferMutation.isPending
                  ? "Refunding..."
                  : "Refund Offer"}
              </Button>
            ) : (
              <Button
                disabled={takeOfferMutation.isPending}
                onClick={handleTakeOffer}
              >
                {takeOfferMutation.isPending ? "Taking Offer..." : "Take Offer"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface OfferCardProps {
  readonly offer: { pubkey: Address; account: Account<Offer> };
  readonly onClick: () => void;
}

function OfferCard({ offer, onClick }: OfferCardProps) {
  const { account } = useWalletUi();
  const isOwner = account?.address === offer.account.data.maker;

  const formatAmount = (amount: bigint) => {
    const DECIMALS = 1_000_000_000n;
    return (Number(amount) / Number(DECIMALS)).toFixed(4);
  };

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge
              className="text-xs"
              variant={isOwner ? "secondary" : "outline"}
            >
              {isOwner
                ? "Your Offer"
                : `Offer #${offer.account.data.id.toString()}`}
            </Badge>
            <Button className="h-8 text-xs" size="sm" variant="ghost">
              View Details
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-center">
              <div className="text-green-600">
                <div className="font-semibold text-lg">
                  {formatAmount(offer.account.data.offeredAmount)}
                </div>
                <div className="text-muted-foreground text-xs">
                  {ellipsify(offer.account.data.offeredMint.toString(), 8)}
                </div>
              </div>

              <div className="my-1 text-muted-foreground text-sm">↓</div>

              <div className="text-blue-600">
                <div className="font-semibold text-lg">
                  {formatAmount(offer.account.data.requestedAmount)}
                </div>
                <div className="text-muted-foreground text-xs">
                  {ellipsify(offer.account.data.requestedMint.toString(), 8)}
                </div>
              </div>
            </div>

            <div className="border-t pt-2 text-center text-muted-foreground text-xs">
              Maker: {ellipsify(offer.account.data.maker.toString(), 8)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OfferListing() {
  const programId = useDealforgeProgramId();
  const { accounts, isLoading: addressesLoading } = useProgramAccounts({
    program: programId,
    config: {
      dataSlice: { offset: 0, length: 0 },
      filters: [
        {
          memcmp: {
            offset: 0n,
            encoding: "base64",
            bytes: Array.from(
              OFFER_DISCRIMINATOR
            ) as unknown as Base64EncodedBytes,
          },
        },
      ],
    },
  });

  const accountsAddress = useMemo(
    () => accounts?.map((a) => a.pubkey) ?? [],
    [accounts]
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching: isOfferFetching,
    isFetchingNextPage,
    isLoading,
  } = useOffersPaginated(accountsAddress);

  const isFetching = isOfferFetching || addressesLoading;

  const [selectedOffer, setSelectedOffer] = useState<{
    pubkey: Address;
    account: Account<Offer>;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const allOffers = data?.pages.flat() || [];

  const handleOfferClick = (offer: {
    pubkey: Address;
    account: Account<Offer>;
  }) => {
    setSelectedOffer(offer);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-muted-foreground">Loading offers...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-destructive">Error loading offers</div>
            <div className="mt-2 text-muted-foreground text-sm">
              {error instanceof Error ? error.message : "Unknown error"}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (allOffers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-muted-foreground">No offers found</div>
            <div className="mt-2 text-muted-foreground text-sm">
              Be the first to create an offer!
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allOffers.map((offer) => (
          <OfferCard
            key={offer.pubkey.toString()}
            offer={offer}
            onClick={() => handleOfferClick(offer)}
          />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            variant="outline"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More Offers"}
          </Button>
        </div>
      )}

      {isFetching && !isFetchingNextPage && (
        <div className="flex justify-center">
          <div className="text-muted-foreground text-sm">Refreshing...</div>
        </div>
      )}

      {selectedOffer && (
        <OfferDetails
          offer={selectedOffer}
          onOpenChange={setDialogOpen}
          open={dialogOpen}
        />
      )}
    </div>
  );
}

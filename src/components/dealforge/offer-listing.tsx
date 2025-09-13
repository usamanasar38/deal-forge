"use client";

import type { Offer } from "@project/anchor";
import { ellipsify, useWalletUi } from "@wallet-ui/react";
import type { Account, Address } from "gill";
import { useState } from "react";
import { ExplorerLink } from "@/components/cluster/cluster-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useOfferQuery,
  useOffersPaginated,
  useRefundOfferMutation,
  useTakeOfferMutation,
} from "./dealforge-data-access";

interface OfferDetailsProps {
  readonly maker: Address;
  readonly offerId: bigint;
  readonly onClose?: () => void;
}

function OfferDetails({ maker, offerId, onClose }: OfferDetailsProps) {
  const { account } = useWalletUi();
  const offerQuery = useOfferQuery(maker, offerId);
  const takeOfferMutation = useTakeOfferMutation();
  const refundOfferMutation = useRefundOfferMutation();

  const isOwner = account?.address === maker;
  const offer = offerQuery.data;

  const formatAmount = (amount: bigint) => {
    const DECIMALS = 1_000_000_000n;
    return (Number(amount) / Number(DECIMALS)).toFixed(9);
  };

  const handleTakeOffer = async () => {
    if (!offer) return;

    await takeOfferMutation.mutateAsync({
      offer,
      offeredMint: offer.data.offeredMint,
      requestedMint: offer.data.requestedMint,
    });
  };

  const handleRefundOffer = async () => {
    if (!offer) return;

    await refundOfferMutation.mutateAsync({
      offerId,
      offeredMint: offer.data.offeredMint,
    });
  };

  if (offerQuery.isLoading) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="p-6">
          <div className="text-center">Loading offer...</div>
        </CardContent>
      </Card>
    );
  }

  if (offerQuery.error) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error loading offer. It may not exist or have been closed.
          </div>
          {onClose && (
            <Button className="mt-4" onClick={onClose} variant="outline">
              Back to List
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!offer) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="p-6">
          <div className="text-center">Offer not found</div>
          {onClose && (
            <Button className="mt-4" onClick={onClose} variant="outline">
              Back to List
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Offer Details</CardTitle>
            <CardDescription>Offer ID: {offerId.toString()}</CardDescription>
          </div>
          {isOwner && <Badge variant="secondary">Your Offer</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Offered Token */}
          <div className="space-y-2">
            <h3 className="font-semibold text-green-600">Offering</h3>
            <div className="space-y-1">
              <div className="font-bold text-2xl">
                {formatAmount(offer.data.offeredAmount)}
              </div>
              <div className="text-gray-500 text-sm">
                <ExplorerLink
                  address={offer.data.offeredMint.toString()}
                  label={ellipsify(offer.data.offeredMint.toString())}
                />
              </div>
            </div>
          </div>

          {/* Requested Token */}
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-600">Requesting</h3>
            <div className="space-y-1">
              <div className="font-bold text-2xl">
                {formatAmount(offer.data.requestedAmount)}
              </div>
              <div className="text-gray-500 text-sm">
                <ExplorerLink
                  address={offer.data.requestedMint.toString()}
                  label={ellipsify(offer.data.requestedMint.toString())}
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
            address={offer.data.maker.toString()}
            label={ellipsify(offer.data.maker.toString())}
          />
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Back to List
            </Button>
          )}

          {isOwner ? (
            <Button
              disabled={refundOfferMutation.isPending}
              onClick={handleRefundOffer}
              variant="destructive"
            >
              {refundOfferMutation.isPending ? "Refunding..." : "Refund Offer"}
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
      </CardContent>
    </Card>
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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={isOwner ? "secondary" : "outline"}>
                {isOwner
                  ? "Your Offer"
                  : `Offer #${offer.account.data.id.toString()}`}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-green-600">
                <span className="font-semibold">
                  {formatAmount(offer.account.data.offeredAmount)}
                </span>
                <span className="ml-1 text-muted-foreground">
                  {ellipsify(offer.account.data.offeredMint.toString(), 6)}
                </span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="text-blue-600">
                <span className="font-semibold">
                  {formatAmount(offer.account.data.requestedAmount)}
                </span>
                <span className="ml-1 text-muted-foreground">
                  {ellipsify(offer.account.data.requestedMint.toString(), 6)}
                </span>
              </div>
            </div>
            <div className="text-muted-foreground text-xs">
              Maker: {ellipsify(offer.account.data.maker.toString())}
            </div>
          </div>
          <Button size="sm" variant="ghost">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function OfferListing() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useOffersPaginated();

  const [selectedOffer, setSelectedOffer] = useState<{
    maker: Address;
    offerId: bigint;
  } | null>(null);

  const allOffers = data?.pages.flat() || [];

  const handleOfferClick = (offer: { pubkey: Address; account: Offer }) => {
    setSelectedOffer({
      maker: offer.account.maker,
      offerId: offer.account.id,
    });
  };

  if (selectedOffer) {
    return (
      <OfferDetails
        maker={selectedOffer.maker}
        offerId={selectedOffer.offerId}
        onClose={() => setSelectedOffer(null)}
      />
    );
  }

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
      <div className="grid gap-4">
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
    </div>
  );
}

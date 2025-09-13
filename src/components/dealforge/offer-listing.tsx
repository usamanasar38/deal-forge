"use client";

import { ellipsify, useWalletUi } from "@wallet-ui/react";
import { type Address, address } from "gill";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  useOfferQuery,
  useOffersQuery,
  useRefundOfferMutation,
  useTakeOfferMutation,
} from "./dealforge-data-access";

interface OfferSearchProps {
  readonly onOfferFound?: (maker: Address, offerId: bigint) => void;
}

function OfferSearch({ onOfferFound }: OfferSearchProps) {
  useOffersQuery();
  const [makerAddress, setMakerAddress] = useState("");
  const [offerId, setOfferId] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!(makerAddress && offerId)) return;

    try {
      setIsSearching(true);
      const maker = address(makerAddress);
      const id = BigInt(offerId);
      onOfferFound?.(maker, id);
    } catch (error) {
      console.error("Invalid input:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Search Offer</CardTitle>
        <CardDescription>
          Enter maker address and offer ID to view an offer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="maker">Maker Address</Label>
          <Input
            id="maker"
            onChange={(e) => setMakerAddress(e.target.value)}
            placeholder="Enter maker wallet address"
            value={makerAddress}
          />
        </div>
        <div>
          <Label htmlFor="offerId">Offer ID</Label>
          <Input
            id="offerId"
            onChange={(e) => setOfferId(e.target.value)}
            placeholder="Enter offer ID"
            type="number"
            value={offerId}
          />
        </div>
        <Button
          className="w-full"
          disabled={!(makerAddress && offerId) || isSearching}
          onClick={handleSearch}
        >
          {isSearching ? "Searching..." : "Search Offer"}
        </Button>
      </CardContent>
    </Card>
  );
}

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
      maker,
      offerId,
      offeredMint: offer.offeredMint,
      requestedMint: offer.requestedMint,
    });
  };

  const handleRefundOffer = async () => {
    if (!offer) return;

    await refundOfferMutation.mutateAsync({
      offerId,
      offeredMint: offer.offeredMint,
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
              Back to Search
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
              Back to Search
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
                {formatAmount(offer.offeredAmount)}
              </div>
              <div className="text-gray-500 text-sm">
                <ExplorerLink
                  address={offer.offeredMint.toString()}
                  label={ellipsify(offer.offeredMint.toString())}
                />
              </div>
            </div>
          </div>

          {/* Requested Token */}
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-600">Requesting</h3>
            <div className="space-y-1">
              <div className="font-bold text-2xl">
                {formatAmount(offer.requestedAmount)}
              </div>
              <div className="text-gray-500 text-sm">
                <ExplorerLink
                  address={offer.requestedMint.toString()}
                  label={ellipsify(offer.requestedMint.toString())}
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
            address={offer.maker.toString()}
            label={ellipsify(offer.maker.toString())}
          />
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Back to Search
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

export function OfferListing() {
  const [searchParams, setSearchParams] = useState<{
    maker: Address;
    offerId: bigint;
  } | null>(null);

  const handleOfferFound = (maker: Address, offerId: bigint) => {
    setSearchParams({ maker, offerId });
  };

  const handleBack = () => {
    setSearchParams(null);
  };

  if (searchParams) {
    return (
      <OfferDetails
        maker={searchParams.maker}
        offerId={searchParams.offerId}
        onClose={handleBack}
      />
    );
  }

  return <OfferSearch onOfferFound={handleOfferFound} />;
}

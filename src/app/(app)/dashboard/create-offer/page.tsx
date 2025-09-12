"use client";

import { useWalletUi } from "@wallet-ui/react";
import { useRouter } from "next/navigation";
import { OfferForm } from "@/components/dealforge/offer-form";
import { WalletButton } from "@/components/solana/solana-provider";

export default function CreateOfferPage() {
  const { account } = useWalletUi();
  const router = useRouter();

  const handleOfferCreated = () => {
    // Redirect to dashboard to show all offers after creating
    router.push("/dashboard");
  };

  if (!account) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 font-bold text-2xl text-foreground">
            Connect Wallet
          </h1>
          <p className="mb-8 text-muted-foreground">
            Please connect your wallet to create offers
          </p>
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-3xl text-foreground">
          Create New Offer
        </h1>
        <p className="text-muted-foreground">
          Set up an escrow offer for token trading
        </p>
      </div>
      <OfferForm onSuccess={handleOfferCreated} />
    </div>
  );
}

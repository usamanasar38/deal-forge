"use client";

import { useWalletUi } from "@wallet-ui/react";
import { Handshake, LogOut, Menu, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { OfferForm } from "@/components/dealforge/offer-form";
import { OfferListing } from "@/components/dealforge/offer-listing";
import { WalletButton } from "@/components/solana/solana-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Page() {
  const { account, disconnect } = useWalletUi();
  const [activeTab, setActiveTab] = useState("create");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleOfferCreated = () => {
    // Switch to search tab after creating an offer
    setActiveTab("search");
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!account) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <div className="mb-4 inline-block rounded-xl bg-primary p-4 shadow-lg ring-1 ring-border">
              <Handshake className="h-12 w-12 text-primary-foreground" />
            </div>
            <h1 className="mb-4 font-bold text-4xl text-foreground">
              DealForge Dashboard
            </h1>
            <p className="mb-8 text-muted-foreground">
              Connect your wallet to access the trading platform
            </p>
          </div>
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {activeTab === "create" && (
            <div className="space-y-6">
              <div className="mb-8 text-center">
                <h2 className="mb-2 font-bold text-3xl text-foreground">
                  Create New Offer
                </h2>
                <p className="text-muted-foreground">
                  Set up an escrow offer for token trading
                </p>
              </div>
              <OfferForm onSuccess={handleOfferCreated} />
            </div>
          )}

          {activeTab === "search" && (
            <div className="space-y-6">
              <div className="mb-8 text-center">
                <h2 className="mb-2 font-bold text-3xl text-foreground">
                  Browse Offers
                </h2>
                <p className="text-muted-foreground">
                  Search for and interact with existing offers
                </p>
              </div>
              <OfferListing />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

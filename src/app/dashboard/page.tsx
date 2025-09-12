"use client";

import { useWalletUi } from "@wallet-ui/react";
import { Handshake, LogOut, Plus, Search } from "lucide-react";
import { useState } from "react";
import { OfferForm } from "@/components/dealforge/offer-form";
import { OfferListing } from "@/components/dealforge/offer-listing";
import { WalletButton } from "@/components/solana/solana-provider";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { account, disconnect } = useWalletUi();
  const [activeTab, setActiveTab] = useState("create");

  const handleOfferCreated = () => {
    // Switch to search tab after creating an offer
    setActiveTab("search");
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (!account) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center text-white">
          <div className="mb-8">
            <div className="mb-4 inline-block rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-4 shadow-2xl">
              <Handshake className="h-12 w-12 text-white" />
            </div>
            <h1 className="mb-4 font-bold text-4xl">DealForge Dashboard</h1>
            <p className="mb-8 text-gray-300">
              Connect your wallet to access the trading platform
            </p>
          </div>
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div className="flex w-64 flex-col border-white/10 border-r bg-black/20 backdrop-blur-lg">
        {/* Logo */}
        <div className="border-white/10 border-b p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2">
              <Handshake className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-bold text-white text-xl">DealForge</h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            <Button
              className={`w-full justify-start ${
                activeTab === "create"
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => setActiveTab("create")}
              variant={activeTab === "create" ? "secondary" : "ghost"}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Offer
            </Button>

            <Button
              className={`w-full justify-start ${
                activeTab === "search"
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => setActiveTab("search")}
              variant={activeTab === "search" ? "secondary" : "ghost"}
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Offers
            </Button>
          </nav>
        </div>

        {/* User Info & Disconnect */}
        <div className="border-white/10 border-t p-4">
          <div className="mb-3 text-gray-300 text-xs">Connected Wallet:</div>
          <div className="mb-4 break-all font-mono text-sm text-white">
            {account.address.toString().slice(0, 16)}...
            {account.address.toString().slice(-16)}
          </div>
          <Button
            className="w-full text-gray-300 hover:bg-red-600/20 hover:text-white"
            onClick={handleDisconnect}
            size="sm"
            variant="ghost"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeTab === "create" && (
            <div className="space-y-6">
              <div className="mb-8 text-center">
                <h2 className="mb-2 font-bold text-3xl text-white">
                  Create New Offer
                </h2>
                <p className="text-gray-300">
                  Set up an escrow offer for token trading
                </p>
              </div>
              <OfferForm onSuccess={handleOfferCreated} />
            </div>
          )}

          {activeTab === "search" && (
            <div className="space-y-6">
              <div className="mb-8 text-center">
                <h2 className="mb-2 font-bold text-3xl text-white">
                  Browse Offers
                </h2>
                <p className="text-gray-300">
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

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
      {/* Collapsible Sidebar */}
      <div
        className={cn(
          "flex flex-col border-border border-r bg-card/30 backdrop-blur-sm transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header with Toggle */}
        <div className="flex items-center justify-between border-border border-b p-4">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-primary p-2">
                <Handshake className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="font-bold text-card-foreground text-xl">
                DealForge
              </h1>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="mx-auto rounded-lg bg-primary p-2">
              <Handshake className="h-6 w-6 text-primary-foreground" />
            </div>
          )}
          <Button
            className="h-8 w-8 p-0 text-muted-foreground hover:text-card-foreground"
            onClick={toggleSidebar}
            size="sm"
            variant="ghost"
          >
            {sidebarCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3">
          <nav className="space-y-2">
            <Button
              className={cn(
                "w-full transition-all duration-200",
                sidebarCollapsed ? "justify-center px-0" : "justify-start",
                activeTab === "create"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-accent hover:text-card-foreground"
              )}
              onClick={() => setActiveTab("create")}
              title={sidebarCollapsed ? "Create Offer" : undefined}
              variant={activeTab === "create" ? "default" : "ghost"}
            >
              <Plus className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")} />
              {!sidebarCollapsed && "Create Offer"}
            </Button>

            <Button
              className={cn(
                "w-full transition-all duration-200",
                sidebarCollapsed ? "justify-center px-0" : "justify-start",
                activeTab === "search"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-accent hover:text-card-foreground"
              )}
              onClick={() => setActiveTab("search")}
              title={sidebarCollapsed ? "Browse Offers" : undefined}
              variant={activeTab === "search" ? "default" : "ghost"}
            >
              <Search className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")} />
              {!sidebarCollapsed && "Browse Offers"}
            </Button>
          </nav>
        </div>

        {/* User Info & Disconnect */}
        <div className="border-border border-t p-3">
          {!sidebarCollapsed && (
            <>
              <div className="mb-2 text-muted-foreground text-xs">
                Connected Wallet:
              </div>
              <div className="mb-3 break-all font-mono text-card-foreground text-xs">
                {account.address.toString().slice(0, 8)}...
                {account.address.toString().slice(-8)}
              </div>
            </>
          )}
          <Button
            className={cn(
              "w-full text-muted-foreground hover:bg-destructive/10 hover:text-card-foreground",
              sidebarCollapsed && "px-0"
            )}
            onClick={handleDisconnect}
            size="sm"
            title={sidebarCollapsed ? "Disconnect" : undefined}
            variant="ghost"
          >
            <LogOut className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")} />
            {!sidebarCollapsed && "Disconnect"}
          </Button>
        </div>
      </div>

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

"use client";

import { useWalletUi } from "@wallet-ui/react";
import { ArrowRight, Globe, Handshake, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { WalletButton } from "@/components/solana/solana-provider";
import { Card, CardContent } from "@/components/ui/card";

export function DealforgeHomePage() {
  const { account } = useWalletUi();
  const router = useRouter();

  // Redirect to dashboard if wallet is connected
  useEffect(() => {
    if (account) {
      router.push("/dashboard");
    }
  }, [account, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Background overlay with theme colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary))_0%,transparent_50%)] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent))_0%,transparent_50%)] opacity-15" />

      {/* Top Navigation with Wallet Button */}
      <div className="absolute top-0 right-0 left-0 z-20">
        <div className="flex justify-end p-6">
          <WalletButton />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16 animate-fade-up text-center">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center">
            <div className="rounded-xl bg-primary p-4 shadow-lg ring-1 ring-primary/20">
              <Handshake className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>

          {/* Title and Description */}
          <h1 className="mb-6 bg-gradient-to-br from-foreground via-foreground/90 to-muted-foreground bg-clip-text font-bold text-5xl text-transparent md:text-7xl">
            DealForge
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-muted-foreground text-xl md:text-2xl">
            Decentralized OTC Trading Platform built on Solana
          </p>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground/80">
            Create secure escrow offers and trade tokens directly with other
            users
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16 grid w-full max-w-4xl animate-fade-up grid-cols-1 gap-6 [animation-delay:200ms] md:grid-cols-3">
          <Card className="group border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/80">
            <CardContent className="p-6 text-center">
              <div className="mb-4 inline-flex rounded-lg bg-chart-4/20 p-3">
                <Zap className="h-8 w-8 text-chart-4" />
              </div>
              <h3 className="mb-2 font-semibold text-card-foreground text-xl">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground">
                Built on Solana for instant transactions with minimal fees
              </p>
            </CardContent>
          </Card>

          <Card className="group border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/80">
            <CardContent className="p-6 text-center">
              <div className="mb-4 inline-flex rounded-lg bg-chart-2/20 p-3">
                <Shield className="h-8 w-8 text-chart-2" />
              </div>
              <h3 className="mb-2 font-semibold text-card-foreground text-xl">
                Secure Escrow
              </h3>
              <p className="text-muted-foreground">
                Smart contracts ensure safe token swaps with automatic
                settlement
              </p>
            </CardContent>
          </Card>

          <Card className="group border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/80">
            <CardContent className="p-6 text-center">
              <div className="mb-4 inline-flex rounded-lg bg-chart-1/20 p-3">
                <Globe className="h-8 w-8 text-chart-1" />
              </div>
              <h3 className="mb-2 font-semibold text-card-foreground text-xl">
                Decentralized
              </h3>
              <p className="text-muted-foreground">
                No intermediaries, trade directly peer-to-peer with full control
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        {!account && (
          <div className="animate-fade-up text-center [animation-delay:400ms]">
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <span>Connect your wallet to get started</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-20 grid w-full max-w-2xl animate-fade-up grid-cols-1 gap-8 text-center [animation-delay:600ms] md:grid-cols-3">
          <div className="rounded-lg border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
            <div className="mb-2 font-bold text-3xl text-foreground">24/7</div>
            <div className="text-muted-foreground">Always Available</div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
            <div className="mb-2 font-bold text-3xl text-foreground">0%</div>
            <div className="text-muted-foreground">Platform Fees</div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
            <div className="mb-2 font-bold text-3xl text-foreground">100%</div>
            <div className="text-muted-foreground">Decentralized</div>
          </div>
        </div>
      </div>
    </div>
  );
}

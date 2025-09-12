"use client";

import { useWalletUi } from "@wallet-ui/react";
import {
  Activity,
  ArrowRight,
  Globe,
  Handshake,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { WalletButton } from "@/components/solana/solana-provider";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-primary p-2">
              <Handshake className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">DealForge</span>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container relative py-24 lg:py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Badge className="mb-4" variant="outline">
            <Activity className="mr-2 h-3 w-3" />
            Live on Solana Mainnet
          </Badge>

          <h1 className="mb-6 font-bold text-4xl tracking-tighter sm:text-6xl md:text-7xl">
            Decentralized
            <span className="text-primary"> OTC Trading</span>
          </h1>

          <p className="mb-8 max-w-[600px] text-lg text-muted-foreground sm:text-xl">
            Create secure escrow offers and trade tokens directly with other
            users. Built on Solana for lightning-fast transactions with minimal
            fees.
          </p>

          {!account && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>Connect your wallet to get started</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </div>
      </section>

      {/* Metrics Section */}
      <section className="container py-16">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                Total Volume
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">$2.4M</div>
              <div className="flex items-center space-x-2 text-muted-foreground text-xs">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">+20.1%</span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                Active Offers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">1,248</div>
              <div className="flex items-center space-x-2 text-muted-foreground text-xs">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">+12.5%</span>
                <span>from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                Avg Transaction Time
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">0.4s</div>
              <div className="flex items-center space-x-2 text-muted-foreground text-xs">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">99.9%</span>
                <span>success rate</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                Platform Fees
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">0%</div>
              <div className="text-muted-foreground text-xs">
                Always free to use
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-bold text-3xl tracking-tighter sm:text-4xl">
            Why Choose DealForge?
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Experience the future of decentralized trading with our cutting-edge
            platform
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-chart-4/10 to-chart-4/5 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/20">
                <Zap className="h-5 w-5 text-chart-4" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Built on Solana's high-performance blockchain for instant
                settlements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Execute trades in milliseconds with minimal transaction costs.
                Our platform leverages Solana's speed for the best trading
                experience.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-chart-2/10 to-chart-2/5 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/20">
                <Shield className="h-5 w-5 text-chart-2" />
              </div>
              <CardTitle>Secure Escrow</CardTitle>
              <CardDescription>
                Smart contracts ensure safe token swaps with automatic
                settlement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Your funds are protected by battle-tested smart contracts. Trade
                with confidence knowing your assets are secure.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-chart-1/10 to-chart-1/5 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/20">
                <Globe className="h-5 w-5 text-chart-1" />
              </div>
              <CardTitle>Fully Decentralized</CardTitle>
              <CardDescription>
                No intermediaries, trade directly peer-to-peer with full control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Maintain complete control over your assets. No centralized
                authority, no single point of failure.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-bold text-3xl tracking-tighter">
            Ready to Start Trading?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of traders already using DealForge for secure, fast,
            and decentralized OTC trading.
          </p>
          {!account && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span>Connect your wallet above to access the platform</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="rounded-lg bg-primary p-1.5">
                <Handshake className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">DealForge</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Built with ❤️ on Solana
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

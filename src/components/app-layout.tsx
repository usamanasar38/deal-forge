"use client";

import type React from "react";
import { AccountChecker } from "@/components/account/account-ui";
import { AppFooter } from "@/components/app-footer";
import { ClusterChecker } from "@/components/cluster/cluster-ui";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <div className="flex min-h-screen flex-col">
        {/* <AppHeader links={links} /> */}
        <main className="relative flex w-full flex-1 flex-col bg-background">
          <ClusterChecker>
            <AccountChecker />
          </ClusterChecker>
          {children}
        </main>
        <AppFooter />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

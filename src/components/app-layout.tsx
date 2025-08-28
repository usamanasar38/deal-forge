"use client";

import type React from "react";
import { AccountChecker } from "@/components/account/account-ui";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { ClusterChecker } from "@/components/cluster/cluster-ui";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

export function AppLayout({
  children,
  links,
}: {
  children: React.ReactNode;
  links: { label: string; path: string }[];
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <div className="flex min-h-screen flex-col">
        <AppHeader links={links} />
        <main className="container mx-auto flex-grow p-4">
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

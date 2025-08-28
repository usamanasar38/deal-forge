"use client";

import type React from "react";
import { SolanaProvider } from "@/components/solana/solana-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryProvider } from "./react-query-provider";

export function AppProviders({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <SolanaProvider>{children}</SolanaProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}

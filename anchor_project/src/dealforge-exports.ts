// Here we export some useful types and functions for interacting with the Anchor program.

import type { SolanaClusterId } from "@wallet-ui/react";
import { address } from "gill";
import DealforgeIDL from "../target/idl/dealforge.json" with { type: "json" };
import { DEALFORGE_PROGRAM_ADDRESS } from "./client/js";

// Re-export the generated IDL and type
export { DealforgeIDL };

export const SEEDS = {
  OFFER_SEED: "OFFER_SEED",
};

// This is a helper function to get the program ID for the Dealforge program depending on the cluster.
export function getDealforgeProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case "solana:devnet":
    case "solana:testnet":
      // This is the program ID for the Dealforge program on devnet and testnet.
      return DEALFORGE_PROGRAM_ADDRESS;
    case "solana:mainnet":
    default:
      return DEALFORGE_PROGRAM_ADDRESS;
  }
}

export * from "./client/js";

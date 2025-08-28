// Here we export some useful types and functions for interacting with the Anchor program.

import type { SolanaClusterId } from "@wallet-ui/react";
import { address } from "gill";
import DealforgeIDL from "../target/idl/dealforge.json" with { type: "json" };
import { DEALFORGE_PROGRAM_ADDRESS } from "./client/js";

// Re-export the generated IDL and type
export { DealforgeIDL };

// This is a helper function to get the program ID for the Dealforge program depending on the cluster.
export function getDealforgeProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case "solana:devnet":
    case "solana:testnet":
      // This is the program ID for the Dealforge program on devnet and testnet.
      return address("6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF");
    case "solana:mainnet":
    default:
      return DEALFORGE_PROGRAM_ADDRESS;
  }
}

export * from "./client/js";

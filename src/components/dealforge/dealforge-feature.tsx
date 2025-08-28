import { useWalletUi } from "@wallet-ui/react";
import { AppHero } from "../app-hero";
import { WalletButton } from "../solana/solana-provider";
import {
  DealforgeCreate,
  DealforgeProgram,
  DealforgeProgramExplorerLink,
} from "./dealforge-ui";

export default function DealforgeFeature() {
  const { account } = useWalletUi();

  if (!account) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="hero py-[64px]">
          <div className="hero-content text-center">
            <WalletButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppHero
        subtitle={'Run the program by clicking the "Run program" button.'}
        title="Dealforge"
      >
        <p className="mb-6">
          <DealforgeProgramExplorerLink />
        </p>
        <DealforgeCreate />
      </AppHero>
      <DealforgeProgram />
    </div>
  );
}

import type { Address, KeyPairSigner } from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import { getAssociatedTokenAccountAddress } from "gill/programs";
import { beforeAll, describe, expect, it } from "vitest";
import {
  createTestOffer,
  createToekn,
  createWalletWithSol,
  getTokenAccountBalance,
  mintTokens,
  ONE_MINT_TOKEN,
  tokenProgram,
} from "./utils";

/** Turn on debug mode */
global.__GILL_DEBUG__ = true;

/** Set the debug mode log level (default: `info`) */
global.__GILL_DEBUG_LEVEL__ = "debug";

const aliceInitialTokenAAmount = 100n;
const bobInitialTokenAAmount = 10n;
const bobInitialTokenBAmount = 10n;
const tokenAOfferedAmount = 1n * ONE_MINT_TOKEN;
const tokenBWantedAmount = 1n * ONE_MINT_TOKEN;

describe("dealforge", () => {
  let signer: KeyPairSigner;
  let alice: KeyPairSigner;
  let bob: KeyPairSigner;
  let tokenMintA: KeyPairSigner;
  let tokenMintB: KeyPairSigner;
  let aliceTokenAccountA: Address;
  let aliceTokenAccountB: Address;
  let bobTokenAccountA: Address;
  let bobTokenAccountB: Address;

  beforeAll(async () => {
    signer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET);
    alice = await createWalletWithSol();
    bob = await createWalletWithSol();
    // Create Tokens
    tokenMintA = await createToekn(signer);
    tokenMintB = await createToekn(signer);

    // Mint tokens A and save their address
    aliceTokenAccountA = await mintTokens({
      signer,
      destinationWallet: alice,
      mint: tokenMintA,
      amount: aliceInitialTokenAAmount,
    });

    bobTokenAccountA = await mintTokens({
      signer,
      destinationWallet: bob,
      mint: tokenMintA,
      amount: bobInitialTokenAAmount,
    });

    // Mint token B and save their addresses
    bobTokenAccountB = await mintTokens({
      signer,
      destinationWallet: bob,
      mint: tokenMintB,
      amount: bobInitialTokenBAmount,
    });

    // get alice token B address
    aliceTokenAccountB = await getAssociatedTokenAccountAddress(
      tokenMintB,
      alice,
      tokenProgram
    );
  });

  describe("makeOffer", () => {
    it("successfully creates an offer with valid inputs", async () => {
      const { vault } = await createTestOffer({
        maker: alice,
        offeredMint: tokenMintA,
        requestedMint: tokenMintB,
        makerTokenAccount: aliceTokenAccountA,
        tokenOfferedAmount: tokenAOfferedAmount,
        tokenRequestedAmount: tokenBWantedAmount,
      });

      // Verify the offer was created successfully by checking the vault balance
      const vaultBalanceResponse = await getTokenAccountBalance(vault);
      expect(BigInt(vaultBalanceResponse.amount)).toEqual(tokenAOfferedAmount);
    });
  });
});

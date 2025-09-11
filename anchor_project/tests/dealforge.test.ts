import type { Address, KeyPairSigner } from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import { getAssociatedTokenAccountAddress } from "gill/programs";
import { beforeAll, describe, expect, it } from "vitest";
import { fetchOffer, getTakeOfferInstructionAsync } from "../src";
import {
  createAndConfirmTransaction,
  createTestOffer,
  createToken,
  createWalletWithSol,
  getTokenAccountBalance,
  mintTokens,
  ONE_MINT_TOKEN,
  rpc,
  tokenProgram,
} from "./utils";

/** Turn on debug mode */
global.__GILL_DEBUG__ = true;

/** Set the debug mode log level (default: `info`) */
// global.__GILL_DEBUG_LEVEL__ = "debug";

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

  let data: {
    maker: typeof alice;
    makerOfferedTokenAccount: typeof aliceTokenAccountA;
    makerRequestedTokenAccount: typeof aliceTokenAccountB;
    offeredMint: typeof tokenMintA;
    requestedMint: typeof tokenMintB;
    taker: typeof bob;
    takerOfferedTokenAccount: typeof bobTokenAccountA;
    takerRequestedTokenAccount: typeof bobTokenAccountB;
  };

  beforeAll(async () => {
    signer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET);
    alice = await createWalletWithSol();
    bob = await createWalletWithSol();
    // Create Tokens
    tokenMintA = await createToken(signer);
    tokenMintB = await createToken(signer);

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
    data = {
      maker: alice,
      makerOfferedTokenAccount: aliceTokenAccountA,
      makerRequestedTokenAccount: aliceTokenAccountB,
      offeredMint: tokenMintA,
      requestedMint: tokenMintB,
      taker: bob,
      takerOfferedTokenAccount: bobTokenAccountA,
      takerRequestedTokenAccount: bobTokenAccountB,
    };
  });

  describe("makeOffer", () => {
    it("should successfully creates an offer with valid inputs", async () => {
      const { vault, offer } = await createTestOffer({
        maker: data.maker,
        offeredMint: data.offeredMint,
        requestedMint: data.requestedMint,
        makerTokenAccount: data.makerOfferedTokenAccount,
        tokenOfferedAmount: tokenAOfferedAmount,
        tokenRequestedAmount: tokenBWantedAmount,
      });

      // Verify the offer was created successfully by checking the vault balance
      const vaultBalanceResponse = await getTokenAccountBalance(vault);
      const aliceBlance = await getTokenAccountBalance(aliceTokenAccountA);
      expect(BigInt(vaultBalanceResponse.amount)).toEqual(tokenAOfferedAmount);
      expect(BigInt(aliceBlance.amount)).toEqual(
        aliceInitialTokenAAmount * ONE_MINT_TOKEN - tokenAOfferedAmount
      );

      const takeOfferInstruction = await getTakeOfferInstructionAsync({
        maker: data.maker.address,
        taker: data.taker,
        offeredMint: data.offeredMint.address,
        requestedMint: data.requestedMint.address,
        makerRequestedAta: data.makerRequestedTokenAccount,
        takerOfferedAta: data.takerOfferedTokenAccount,
        takerRequestedAta: data.takerRequestedTokenAccount,
        offer,
        vault,
        tokenProgram,
      });

      await createAndConfirmTransaction({
        ix: [takeOfferInstruction],
        payer: data.taker,
      });
      const [
        aliceTokenABalanceAfter,
        aliceTokenBBalance,
        bobTokenABalanceAfter,
        bobTokenBBalance,
      ] = await Promise.all([
        getTokenAccountBalance(aliceTokenAccountA),
        getTokenAccountBalance(aliceTokenAccountB),
        getTokenAccountBalance(bobTokenAccountA),
        getTokenAccountBalance(bobTokenAccountB),
      ]);

      expect(BigInt(aliceTokenABalanceAfter.amount)).toEqual(
        aliceInitialTokenAAmount * ONE_MINT_TOKEN - tokenAOfferedAmount
      );

      expect(BigInt(aliceTokenBBalance.amount)).toEqual(tokenBWantedAmount);

      expect(BigInt(bobTokenABalanceAfter.amount)).toEqual(
        bobInitialTokenAAmount * ONE_MINT_TOKEN + tokenAOfferedAmount
      );

      expect(BigInt(bobTokenBBalance.amount)).toEqual(
        bobInitialTokenAAmount * ONE_MINT_TOKEN - tokenBWantedAmount
      );

      await expect(fetchOffer(rpc, offer)).rejects.toThrow(
        `Account not found at address: ${offer}`
      );
    });

    it("should fail to make offer when maker has insufficient token balance", async () => {
      const tooManyTokens = 1_000n * ONE_MINT_TOKEN;

      await expect(
        createTestOffer({
          maker: data.maker,
          offeredMint: data.offeredMint,
          requestedMint: data.requestedMint,
          makerTokenAccount: data.makerOfferedTokenAccount,
          tokenOfferedAmount: tooManyTokens,
          tokenRequestedAmount: tokenBWantedAmount,
          skipPreflight: true,
        })
        // insufficient funds error
      ).rejects.toThrow("custom program error: #1");
    });
  });
});

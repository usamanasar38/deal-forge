import {
  type Address,
  airdropFactory,
  type Blockhash,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  type Instruction,
  type KeyPairSigner,
  LAMPORTS_PER_SOL,
  lamports,
  signTransactionMessageWithSigners,
} from "gill";
import { TOKEN_2022_PROGRAM_ADDRESS } from "gill/programs";
import {
  buildCreateTokenTransaction,
  buildMintTokensTransaction,
  getAssociatedTokenAccountAddress,
} from "gill/programs/token";
import { getMakeOfferInstructionAsync } from "../src";
import { getOfferPDA } from "./pda";

/** Turn on debug mode */
global.__GILL_DEBUG__ = true;

const tokenDecimals = 9;
export const tokenProgram = TOKEN_2022_PROGRAM_ADDRESS;
export const ONE_MINT_TOKEN = 10n ** BigInt(tokenDecimals);

export function getLamportsPerSol(solAmount: number) {
  return lamports(BigInt(solAmount * LAMPORTS_PER_SOL));
}

export const { rpc, rpcSubscriptions, sendAndConfirmTransaction } =
  createSolanaClient({
    urlOrMoniker: process.env.ANCHOR_PROVIDER_URL as string,
  });

export function getTokenAccountBalance(tokenAccount: Address) {
  return rpc
    .getTokenAccountBalance(tokenAccount)
    .send()
    .then(({ value }) => value);
}

export async function getLatestBlockhash(): Promise<
  Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>
> {
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value);
}

async function sendAndConfirm(
  tx: ReturnType<typeof createTransaction>,
  skipPreflight = false
) {
  const signedTransaction = await signTransactionMessageWithSigners(tx);
  return await sendAndConfirmTransaction(signedTransaction, {
    commitment: "confirmed",
    skipPreflight,
  });
}

export async function createAndConfirmTransaction({
  ix,
  payer,
  skipPreflight = false,
}: {
  ix: Instruction[];
  payer: KeyPairSigner;
  skipPreflight?: boolean;
}) {
  const tx = createTransaction({
    feePayer: payer,
    instructions: ix,
    version: "legacy",
    latestBlockhash: await getLatestBlockhash(),
  });

  return sendAndConfirm(tx, skipPreflight);
}

export async function createWalletWithSol(amount = 5) {
  const wallet = await generateKeyPairSigner();
  await airdropFactory({ rpc, rpcSubscriptions })({
    commitment: "confirmed",
    lamports: getLamportsPerSol(amount),
    recipientAddress: wallet.address,
  });
  await rpc
    .getBalance(wallet.address)
    .send()
    .then(({ value }) => value);
  return wallet;
}

export async function createToken(payer: KeyPairSigner) {
  const mint = await generateKeyPairSigner();
  const latestBlockhash = await getLatestBlockhash();
  const createTokenTx = await buildCreateTokenTransaction({
    feePayer: payer,
    mint,
    tokenProgram,
    decimals: tokenDecimals,
    metadata: {
      name: "Test Token",
      symbol: "TEST",
      uri: "https://example.com/metadata.json",
      isMutable: true,
    },
    latestBlockhash,
  });
  await sendAndConfirm(createTokenTx);
  return mint;
}

export async function mintTokens({
  signer,
  mint,
  destinationWallet,
  amount,
}: {
  signer: KeyPairSigner;
  mint: KeyPairSigner;
  destinationWallet: KeyPairSigner;
  amount: bigint;
}) {
  const latestBlockhash = await getLatestBlockhash();
  const mintTokensTx = await buildMintTokensTransaction({
    feePayer: signer,
    latestBlockhash,
    mint,
    mintAuthority: signer,
    amount: amount * ONE_MINT_TOKEN,
    destination: destinationWallet,
    tokenProgram,
  });

  await sendAndConfirm(mintTokensTx);
  const tokenAccount = await getAssociatedTokenAccountAddress(
    mint,
    destinationWallet,
    tokenProgram
  );
  // await getTokenAccountBalance(tokenAccount);
  return tokenAccount;
}

export const getRandomBigInt = () => {
  return BigInt(Math.floor(Math.random() * 1_000_000_000_000_000_000));
};

// Helper function to create a test offer
export async function createTestOffer({
  maker,
  offeredMint,
  requestedMint,
  makerTokenAccount,
  tokenOfferedAmount,
  tokenRequestedAmount,
  skipPreflight = false,
}: {
  maker: KeyPairSigner;
  offeredMint: KeyPairSigner;
  requestedMint: KeyPairSigner;
  makerTokenAccount: Address;
  tokenOfferedAmount: bigint;
  tokenRequestedAmount: bigint;
  skipPreflight?: boolean;
}) {
  const offerId = getRandomBigInt();
  const [offer, _offerBump] = await getOfferPDA({
    maker,
    offerId,
  });

  const vault = await getAssociatedTokenAccountAddress(
    offeredMint,
    offer,
    tokenProgram
  );

  const makeOfferInstruction = await getMakeOfferInstructionAsync({
    id: offerId,
    maker,
    offeredMint: offeredMint.address,
    requestedMint: requestedMint.address,
    makerOfferedAta: makerTokenAccount,
    offer,
    vault,
    offeredAmount: tokenOfferedAmount,
    requestedAmount: tokenRequestedAmount,
    tokenProgram,
  });
  const signature = await createAndConfirmTransaction({
    ix: [makeOfferInstruction],
    payer: maker,
    skipPreflight,
  });

  return { offer, vault, signature, offerId };
}

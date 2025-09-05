import {
  type Blockhash,
  createSolanaClient,
  createTransaction,
  type Instruction,
  type KeyPairSigner,
  signTransactionMessageWithSigners,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";

/** Turn on debug mode */
global.__GILL_DEBUG__ = true;

/** Set the debug mode log level (default: `info`) */
global.__GILL_DEBUG_LEVEL__ = "debug";

describe("dealforge", () => {
  let payer: KeyPairSigner;

  beforeAll(async () => {
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!);
  });

  it('should run the program and print "GM!" to the transaction log', async () => {
    // ARRANGE
    expect.assertions(1);
    const ix = getGreetInstruction();

    // ACT
    const sx = await sendAndConfirm({ ix, payer });

    // ASSERT
    expect(sx).toBeDefined();
    console.log("Transaction signature:", sx);
  });
});

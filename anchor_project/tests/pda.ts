import {
  type Address,
  getAddressEncoder,
  getProgramDerivedAddress,
  getU64Encoder,
  type KeyPairSigner,
  type ProgramDerivedAddress,
} from "gill";
import { getAssociatedTokenAccountAddress } from "gill/programs";
import { DEALFORGE_PROGRAM_ADDRESS, SEEDS } from "../src";

export function getOfferPDA({
  maker,
  offerId,
}: {
  maker: KeyPairSigner;
  offerId: number | bigint;
}): Promise<ProgramDerivedAddress> {
  return getProgramDerivedAddress({
    programAddress: DEALFORGE_PROGRAM_ADDRESS,
    seeds: [
      SEEDS.OFFER_SEED, // "offer"
      getAddressEncoder().encode(maker.address),
      getU64Encoder().encode(offerId),
    ],
  });
}

export function getVaultPDA({
  tokenMint,
  offer,
  tokenProgram,
}: {
  tokenMint: Address;
  offer: Address;
  tokenProgram: Address;
}): Promise<Address> {
  return getAssociatedTokenAccountAddress(tokenMint, offer, tokenProgram);
}

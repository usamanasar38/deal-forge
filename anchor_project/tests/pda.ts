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

export function getCounterPDA({
  maker,
}: {
  maker: KeyPairSigner;
}): Promise<ProgramDerivedAddress> {
  return getProgramDerivedAddress({
    programAddress: DEALFORGE_PROGRAM_ADDRESS,
    seeds: [
      SEEDS.MAKER_COUNTER_SEED,
      getAddressEncoder().encode(maker.address),
    ],
  });
}

export function getOfferPDA({
  maker,
  counterId,
}: {
  maker: KeyPairSigner;
  counterId: number | bigint;
}) {
  return getProgramDerivedAddress({
    programAddress: DEALFORGE_PROGRAM_ADDRESS,
    seeds: [
      SEEDS.OFFER_SEED, // "offer"
      getAddressEncoder().encode(maker.address),
      getU64Encoder().encode(counterId),
    ],
  });
}

export function getVaultPDA({
  tokenMintA,
  offer,
  tokenProgram,
}: {
  tokenMintA: Address;
  offer: Address;
  tokenProgram: Address;
}) {
  return getAssociatedTokenAccountAddress(tokenMintA, offer, tokenProgram);
}

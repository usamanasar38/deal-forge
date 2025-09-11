use anchor_lang::prelude::*;

#[constant]
pub const OFFER_SEED: &str = "OFFER_SEED";

#[account]
#[derive(InitSpace)]
pub struct Offer {
    /// Unique identifier for the offer (counter for each user)
    pub id: u64,

    /// The maker (offer creator)
    pub maker: Pubkey,

    /// The token mint being offered
    pub offered_mint: Pubkey,

    /// The token mint that initializer is requesting
    pub requested_mint: Pubkey,

    /// Amount of offered tokens
    pub offered_amount: u64,

    /// Amount of requested tokens
    pub requested_amount: u64,

    /// Expiry timestamp (unix time), after which initializer can cancel
    // pub expiry: i64,

    /// PDA bump seed (to derive vault PDA)
    pub bump: u8,
}

use anchor_lang::prelude::*;

#[constant]
pub const OFFER_SEED: &str = "OFFER_SEED";

/// Possible states of an deal-forge
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq, InitSpace)]
pub enum OfferStatus {
    Active,
    Fulfilled,
    Canceled,
    Expired,
}

impl Default for OfferStatus {
    fn default() -> Self {
        OfferStatus::Active
    }
}

#[account]
#[derive(InitSpace)]
pub struct Offer {
    /// Unique identifier for the offer (counter for each user)
    pub id: u64,

    /// The maker (offer creator)
    pub maker: Pubkey,

    /// The token mint being offered
    pub offered_mint: Pubkey,

    /// The token account that will hold maker’s offered tokens (PDA vault)
    pub offered_vault: Pubkey,

    /// Amount of offered tokens
    pub offered_amount: u64,

    /// The token mint that initializer is requesting
    pub requested_mint: Pubkey,

    /// Amount of requested tokens
    pub requested_amount: u64,

    /// Expiry timestamp (unix time), after which initializer can cancel
    // pub expiry: i64,

    /// Status of the deal-forge (e.g., Active, Completed, Canceled)
    pub status: OfferStatus,

    /// PDA bump seed (to derive offered_vault PDA)
    pub bump: u8,
}

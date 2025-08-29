use anchor_lang::prelude::*;

/// Possible states of an escrow
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum OfferStatus {
    Active,
    Completed,
    Canceled,
    Expired,
}

#[account]
#[derive(InitSpace)]
pub struct Offer {
    /// Unique identifier for the offer (could be a counter or hash)
    pub id: u64,

    /// The initializer (offer creator)
    pub initializer: Pubkey,

    /// The token mint being offered
    pub offered_mint: Pubkey,

    /// The token account that will hold initializer’s offered tokens (PDA vault)
    pub offered_vault: Pubkey,

    /// Amount of offered tokens
    pub offered_amount: u64,

    /// The token mint that initializer is requesting
    pub requested_mint: Pubkey,

    /// Amount of requested tokens
    pub requested_amount: u64,

    /// Expiry timestamp (unix time), after which initializer can cancel
    // pub expiry: i64,

    /// Status of the escrow (e.g., Active, Completed, Canceled)
    pub status: EscrowStatus,

    /// PDA bump seed (to derive offered_vault PDA)
    pub bump: u8,
}

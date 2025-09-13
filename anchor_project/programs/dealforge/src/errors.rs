use anchor_lang::prelude::*;

#[error_code]
pub enum DealForgeError {
    #[msg("Insufficient token balance")]
    InsufficientBalance,
    #[msg("Token transfer failed")]
    TransferFailed,
    #[msg("Invalid sale token")]
    InvalidSaleToken,
    #[msg("Calculation overflow")]
    CalculationOverflow,
    #[msg("Offer is not active")]
    OfferNotActive,
    #[msg("Exceeds available quantity")]
    ExceedsAvailableQuantity,
    #[msg("Offer already fulfilled")]
    OfferAlreadyFulfilled,
    #[msg("Offer expired")]
    OfferExpired,
    #[msg("Invalid offered mint amount")]
    InvalidOfferedMintAmount,
    #[msg("Invalid requested min amount")]
    InvalidRequestedMintAmount,
    #[msg("unauthorized maker")]
    UnauthorizedMaker,
}

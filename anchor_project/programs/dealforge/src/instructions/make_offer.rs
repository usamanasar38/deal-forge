use super::shared::transfer_tokens;
use crate::errors::DealForgeError;
use crate::state::{Offer, OFFER_SEED};
use anchor_lang::prelude::*;
use anchor_lang::Discriminator;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface},
};

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct MakeOffer<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,

    #[account(mint::token_program = token_program)]
    pub offered_mint: InterfaceAccount<'info, Mint>,

    #[account(mint::token_program = token_program)]
    pub requested_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = offered_mint,
        associated_token::authority = maker,
        associated_token::token_program = token_program,
    )]
    pub maker_offered_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = maker,
        space = Offer::DISCRIMINATOR.len() + Offer::INIT_SPACE,
        seeds = [OFFER_SEED.as_bytes(), maker.key().as_ref(), id.to_le_bytes().as_ref()],
        bump
    )]
    pub offer: Account<'info, Offer>,

    #[account(
        init,
        payer = maker,
        associated_token::mint = offered_mint,
        associated_token::authority = offer,
        associated_token::token_program = token_program,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    context: Context<MakeOffer>,
    id: u64,
    offered_amount: u64,
    requested_amount: u64,
) -> Result<()> {
    require!(offered_amount > 0, DealForgeError::InvalidOfferedMintAmount);
    require!(
        requested_amount > 0,
        DealForgeError::InvalidRequestedMintAmount
    );
    require!(
        offered_amount <= context.accounts.maker_offered_ata.amount,
        DealForgeError::InsufficientBalance
    );
    require!(
        requested_amount <= context.accounts.requested_mint.supply,
        DealForgeError::ExceedsAvailableQuantity
    );

    transfer_tokens(
        &context.accounts.maker_offered_ata,
        &context.accounts.vault,
        &offered_amount,
        &context.accounts.offered_mint,
        &context.accounts.maker.to_account_info(),
        &context.accounts.token_program,
        None,
    )?;

    context.accounts.offer.set_inner(Offer {
        id,
        maker: context.accounts.maker.key(),
        offered_mint: context.accounts.offered_mint.key(),
        requested_mint: context.accounts.requested_mint.key(),
        offered_amount,
        requested_amount,
        bump: context.bumps.offer,
    });
    Ok(())
}

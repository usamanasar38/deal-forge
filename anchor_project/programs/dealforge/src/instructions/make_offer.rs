use super::shared::transfer_tokens;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::Discriminator;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface},
};

#[derive(Accounts)]
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
        associated_token::token_program = token_program
    )]
    pub maker_offered_ata: InterfaceAccount<'info, TokenAccount>,

    // Counter PDA (1 per maker)
    #[account(
        init_if_needed,
        payer = maker,
        space = MakerCounter::DISCRIMINATOR.len() + MakerCounter::INIT_SPACE,
        seeds = [MAKER_COUNTER_SEED.as_bytes(), maker.key().as_ref()],
        bump
    )]
    pub counter: Account<'info, MakerCounter>,

    #[account(
        init,
        payer = maker,
        space = Offer::DISCRIMINATOR.len() + Offer::INIT_SPACE,
        seeds = [OFFER_SEED.as_bytes(), maker.key().as_ref(), counter.id.to_le_bytes().as_ref()],
        bump
    )]
    pub offer: Account<'info, Offer>,

    #[account(
        mut,
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
    offered_amount: u64,
    requested_amount: u64,
) -> Result<()> {
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
        id: context.accounts.counter.id,
        maker: context.accounts.maker.key(),
        offered_mint: context.accounts.offered_mint.key(),
        requested_mint: context.accounts.requested_mint.key(),
        vault: context.accounts.vault.key(),
        status: OfferStatus::Active,
        offered_amount,
        requested_amount,
        bump: context.bumps.offer,
    });
    Ok(())
}

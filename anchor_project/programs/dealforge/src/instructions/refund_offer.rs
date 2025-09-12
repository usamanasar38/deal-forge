use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use super::shared::{close_token_account, transfer_tokens};
use crate::state::{Offer, OFFER_SEED};

#[derive(Accounts)]
pub struct RefundOffer<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,

    pub offered_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = offered_mint,
        associated_token::authority = maker,
        associated_token::token_program = token_program
    )]
    pub maker_offered_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        close = maker,
        has_one = maker,
        seeds = [OFFER_SEED.as_bytes(), maker.key().as_ref(), offer.id.to_le_bytes().as_ref()],
        bump = offer.bump,
    )]
    pub offer: Account<'info, Offer>,

    #[account(
        mut,
        associated_token::mint = offered_mint,
        associated_token::authority = offer,
        associated_token::token_program = token_program,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

pub fn handler(context: Context<RefundOffer>) -> Result<()> {
    let maker_key = context.accounts.maker.key();
    let offer_id_bytes = context.accounts.offer.id.to_le_bytes();

    let offer_account_seeds: &[&[u8]] = &[
        OFFER_SEED.as_bytes(),
        maker_key.as_ref(),
        &offer_id_bytes,
        &[context.accounts.offer.bump],
    ];
    let signers_seeds = Some(offer_account_seeds);

    transfer_tokens(
        &context.accounts.vault,
        &context.accounts.maker_offered_ata,
        &context.accounts.vault.amount,
        &context.accounts.offered_mint,
        &context.accounts.offer.to_account_info(),
        &context.accounts.token_program,
        signers_seeds,
    )?;

    close_token_account(
        &context.accounts.vault,
        &context.accounts.maker.to_account_info(),
        &context.accounts.offer.to_account_info(),
        &context.accounts.token_program,
        signers_seeds,
    )
}

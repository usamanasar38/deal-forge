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
        space = 8 + 8, // 8 discriminator + 8 count
        seeds = [MAKER_COUNTER_SEED.as_bytes(), maker.key().as_ref()],
        bump
    )]
    pub counter: Account<'info, MakerCounter>,

    #[account(
        init,
        payer = maker,
        space = Offer::DISCRIMINATOR.len() + Offer::INIT_SPACE,
        seeds = [OFFER_SEED.as_bytes(), maker.key().as_ref(), counter.count.to_le_bytes().as_ref()],
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

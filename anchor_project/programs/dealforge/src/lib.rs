pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("FVszYwFasoQN81yjF4LMCYSzKaGUWkf9KTb3wTrs7mBd");

#[program]
pub mod dealforge {
    use super::*;

    pub fn make_offer(
        context: Context<MakeOffer>,
        id: u64,
        offered_amount: u64,
        requested_amount: u64,
    ) -> Result<()> {
        make_offer::handler(context, id, offered_amount, requested_amount)
    }
}

#[derive(Accounts)]
pub struct Initialize {}

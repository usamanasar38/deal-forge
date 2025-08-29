pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

declare_id!("FVszYwFasoQN81yjF4LMCYSzKaGUWkf9KTb3wTrs7mBd");

#[program]
pub mod dealforge {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

use anchor_lang::prelude::*;

declare_id!("8WZodGZQL523pY77CdxwMejesgd1G4cGozSEtDRq5Qz6");

#[program]
pub mod sol_spark {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

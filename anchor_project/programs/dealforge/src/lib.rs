pub mod errors;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("CL6frD87dGURF5LdxGD7yTdGmcmeFH3cCjEbf3JMmpG2");

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

    pub fn take_offer(context: Context<TakeOffer>) -> Result<()> {
        take_offer::handler(context)
    }

    pub fn refund_offer(context: Context<RefundOffer>) -> Result<()> {
        refund_offer::handler(context)
    }
}

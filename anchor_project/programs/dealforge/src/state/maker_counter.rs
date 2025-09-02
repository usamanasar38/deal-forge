use anchor_lang::prelude::*;

#[constant]
pub const MAKER_COUNTER_SEED: &str = "MAKER_COUNTER_SEED";

#[account]
#[derive(InitSpace)]
pub struct MakerCounter {
    pub id: u64,
}

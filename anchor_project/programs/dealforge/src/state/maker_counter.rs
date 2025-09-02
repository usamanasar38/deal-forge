use anchor_lang::prelude::*;

#[constant]
pub const MAKER_COUNTER_SEED: &str = "MAKER_COUNTER_SEED";

#[account]
pub struct MakerCounter {
    pub count: u64,
}

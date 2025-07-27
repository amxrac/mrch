#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod state;
use instructions::*;

declare_id!("4pcPQyPsCTKD5E3zzibmofY29ggZhRhfpFgFRodmcLzA");

#[program]
pub mod mrch {
    use super::*;

    pub fn create_store(ctx: Context<CreateStore>, seed: u64, name: String) -> Result<()> {
        instructions::create_store::handler(ctx, seed, name)
    }
}

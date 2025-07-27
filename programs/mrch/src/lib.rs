#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod state;
use instructions::*;

declare_id!("FeyoWtEFUGCEe9er1RXWyFDPUZ7PLeCsdvmgDNsjS81M");

#[program]
pub mod mrch {
    use super::*;

    pub fn create_store(ctx: Context<CreateStore>, seed: u64, name: String) -> Result<()> {
        instructions::create_store::handler(ctx, seed, name)
    }

    pub fn create_listing(
        ctx: Context<CreateListing>,
        store_seed: u64,
        listing_seed: u64,
        name: String,
        price: u64,
        quantity: u64,
        image_uri: String,
    ) -> Result<()> {
        instructions::create_listing::handler(
            ctx,
            store_seed,
            listing_seed,
            name,
            price,
            quantity,
            image_uri,
        )
    }
}

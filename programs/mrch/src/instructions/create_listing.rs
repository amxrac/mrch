use crate::errors::*;
use crate::state::{Listing, StoreAccount};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(store_seed: u64, listing_seed: u64, listing_name: String, price: u64, quantity: u64, image_uri: String)]
pub struct CreateListing<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        seeds = [b"store", owner.key().as_ref(), store_seed.to_le_bytes().as_ref()],
        bump,
        constraint = store_account.owner == owner.key()
    )]
    pub store_account: Account<'info, StoreAccount>,
    #[account(
        init,
        payer = owner,
        space = Listing::INIT_SPACE + 8,
        seeds = [b"listing", store_account.key().as_ref(), listing_seed.to_le_bytes().as_ref()],
        bump
    )]
    pub listing_account: Account<'info, Listing>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateListing>,
    store_seed: u64,
    listing_seed: u64,
    listing_name: String,
    price: u64,
    quantity: u64,
    image_uri: String,
) -> Result<()> {
    let listing = &mut ctx.accounts.listing_account;
    require_gt!(price, 0, PurchaseError::InvalidPrice);
    listing.store = ctx.accounts.store_account.key();
    listing.listing_name = listing_name;
    listing.price = price;
    listing.quantity = quantity;
    listing.image_uri = image_uri;
    listing.bump = ctx.bumps.listing_account;
    Ok(())
}

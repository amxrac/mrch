use anchor_lang::{prelude::*, system_program};

use crate::errors::PurchaseError;
use crate::state::{Listing, PurchaseEscrow, PurchaseEscrowStatus, StoreAccount};

#[derive(Accounts)]
#[instruction(store_seed: u64, listing_seed: u64, escrow_seed: u64, quantity: u64)]
pub struct Purchase<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: this account is only being used for pda derivation for the store_account
    pub store_owner: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [b"store", store_owner.key().as_ref(), store_seed.to_le_bytes().as_ref()],
        bump,
    )]
    pub store_account: Account<'info, StoreAccount>,
    #[account(
        mut,
        seeds = [b"listing", store_account.key().as_ref(), listing_seed.to_le_bytes().as_ref()],
        bump,
        constraint = listing.quantity > 0
    )]
    pub listing: Account<'info, Listing>,
    #[account(
        init,
        payer = buyer,
        space = PurchaseEscrow::INIT_SPACE + 8,
        seeds = [b"escrow", buyer.key().as_ref(), escrow_seed.to_le_bytes().as_ref()],
        bump
    )]
    pub escrow: Account<'info, PurchaseEscrow>,
    pub system_program: Program<'info, System>,
}

impl<'info> Purchase<'info> {
    fn populate_escrow(
        &mut self,
        price: u64,
        quantity: u64,
        item_name: String,
        bump: u8,
    ) -> Result<()> {
        self.escrow.set_inner(PurchaseEscrow {
            buyer: self.buyer.key(),
            store: self.store_account.key(),
            listing: self.listing.key(),
            price,
            quantity,
            item_name,
            status: PurchaseEscrowStatus::Pending,
            bump,
        });

        Ok(())
    }

    fn transfer_sol_to_escrow(&mut self, price: u64) -> Result<()> {
        let transfer_cpi = system_program::Transfer {
            from: self.buyer.to_account_info(),
            to: self.escrow.to_account_info(),
        };

        system_program::transfer(
            CpiContext::new(self.system_program.to_account_info(), transfer_cpi),
            price,
        )?;

        Ok(())
    }
}

pub fn handler(
    ctx: Context<Purchase>,
    store_seed: u64,
    listing_seed: u64,
    escrow_seed: u64,
    quantity: u64,
) -> Result<()> {
    let listing = &ctx.accounts.listing;
    let total_price = listing.price * quantity;
    require_gt!(quantity, 0, PurchaseError::InvalidQuantity);
    require_gte!(
        ctx.accounts.buyer.lamports(),
        total_price,
        PurchaseError::InsufficientFunds
    );
    require_gte!(listing.quantity, quantity, PurchaseError::InsufficientStock);

    ctx.accounts.populate_escrow(
        total_price,
        quantity,
        listing.listing_name.clone(),
        ctx.bumps.escrow,
    )?;
    ctx.accounts.transfer_sol_to_escrow(total_price)?;

    ctx.accounts.listing.quantity -= quantity;
    Ok(())
}

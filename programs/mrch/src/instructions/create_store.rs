use crate::state::StoreAccount;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(seed: u64, store_name: String)]
pub struct CreateStore<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
            init,
            payer = owner,
            space = StoreAccount::INIT_SPACE + 8,
            seeds = [b"store", owner.key().as_ref(), seed.to_le_bytes().as_ref()],
            bump
        )]
    pub store_account: Account<'info, StoreAccount>,
    pub system_program: Program<'info, System>,
}
pub fn handler(ctx: Context<CreateStore>, seed: u64, store_name: String) -> Result<()> {
    let store = &mut ctx.accounts.store_account;
    store.owner = ctx.accounts.owner.key();
    store.store_name = store_name;
    store.bump = ctx.bumps.store_account;
    Ok(())
}

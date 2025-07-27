use anchor_lang::prelude::*;

#[derive(InitSpace)]
#[account]
pub struct PurchaseEscrow {
    pub seed: u64,
    pub buyer: Pubkey,
    pub listing_id: u64,
    #[max_len(100)]
    pub item_name: String,
    pub status: PurchaseEscrowStatus,
    pub bump: u8,
}

#[derive(InitSpace)]
#[account]
pub struct Listing {
    pub store: Pubkey,
    pub listing_id: u64,
    #[max_len(100)]
    pub name: String,
    pub price: u64,
    pub quantity: u64,
    #[max_len(100)]
    pub image_uri: String,
    pub bump: u8,
}

#[derive(InitSpace)]
#[account]
pub struct StoreAccount {
    pub owner: Pubkey,
    pub seed: u64,
    #[max_len(100)]
    pub name: String,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub enum PurchaseEscrowStatus {
    Pending,
    Fulfilled,
    Cancelled,
}

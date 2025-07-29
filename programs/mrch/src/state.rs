use anchor_lang::prelude::*;

#[derive(InitSpace)]
#[account]
pub struct PurchaseEscrow {
    pub buyer: Pubkey,
    pub store: Pubkey,
    pub listing: Pubkey,
    pub price: u64,
    pub quantity: u64,
    #[max_len(100)]
    pub item_name: String,
    pub status: PurchaseEscrowStatus,
    pub bump: u8,
}

#[derive(InitSpace)]
#[account]
pub struct Listing {
    pub store: Pubkey,
    #[max_len(100)]
    pub listing_name: String,
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
    #[max_len(100)]
    pub store_name: String,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub enum PurchaseEscrowStatus {
    Pending,
    Fulfilled,
    Cancelled,
}

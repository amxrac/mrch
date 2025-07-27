use anchor_lang::prelude::*;

#[error_code]
pub enum PurchaseEscrowError {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Invalid store")]
    InvalidStore,
}

use anchor_lang::prelude::*;

#[error_code]
pub enum PurchaseEscrowError {
    #[msg("Invalid Price")]
    InvalidPrice,
    #[msg("Invalid store")]
    InvalidStore,
    #[msg("Invalid quantity")]
    InvalidQuantity,
    #[msg("Insufficient stock")]
    InsufficientStock,
}

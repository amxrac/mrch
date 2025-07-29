use anchor_lang::prelude::*;

#[error_code]
pub enum PurchaseError {
    #[msg("Invalid Price")]
    InvalidPrice,
    #[msg("Invalid store")]
    InvalidStore,
    #[msg("Invalid quantity")]
    InvalidQuantity,
    #[msg("Insufficient stock")]
    InsufficientStock,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}

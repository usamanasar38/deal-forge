# Project Description

**Deployed Frontend URL:** [DealForge](https://deal-forge.usamanasar.dev/)

**Solana Program ID:** CL6frD87dGURF5LdxGD7yTdGmcmeFH3cCjEbf3JMmpG2

## Project Overview

### Description

DealForge is a Decentralized OTC Trading Platform built on Solana that enables secure peer-to-peer token swaps through an escrow system. Users can create token swap offers, specifying the tokens they want to trade and the tokens they want in return. The platform uses smart contracts to hold offered tokens in escrow until a counterparty accepts the trade, ensuring trustless and atomic swaps without the need for intermediaries.

### Key Features

- **Create Offers**: Users can create token swap offers by specifying offered and requested tokens with amounts
- **Browse Offers**: View all available offers in a paginated list with detailed information
- **Take Offers**: Accept any available offer to complete the token swap instantly
- **Refund Offers**: Offer creators can cancel and refund their offers at any time
- **Escrow Security**: All offered tokens are held securely in program-controlled accounts until trade completion
- **Wallet Integration**: Seamless connection with Solana wallets for transaction signing

### How to Use the dApp

1. **Connect Wallet** - Connect your Solana wallet to access trading features
2. **Create Offer** - Navigate to "Create Offer" page, enter token mint addresses and amounts for the swap
3. **Browse Offers** - View all available offers on the dashboard with token details and amounts
4. **Take Offers** - Click on any offer to view details and execute the swap by clicking "Take Offer"
5. **Manage Your Offers** - View your own offers (marked with "Your Offer" badge) and refund if needed

## Program Architecture

The DealForge program implements a secure escrow-based token trading system using three core instructions that manage offer lifecycle. The architecture ensures atomic swaps by holding offered tokens in program-controlled accounts until trades are completed or cancelled.

### PDA Usage

The program leverages Program Derived Addresses to create deterministic and secure accounts for offers and token vaults.

**PDAs Used:**

- **Offer PDA**: Derived from seeds `["OFFER_SEED", maker_pubkey, offer_id]` - creates unique offer accounts for each user's offers, preventing conflicts and ensuring only the maker can manage their offers
- **Vault PDA**: Associated Token Account owned by the Offer PDA - securely holds escrowed tokens using the offer account as authority, ensuring tokens can only be released through program instructions

### Program Instructions

**Instructions Implemented:**

- **make_offer**: Creates a new offer by initializing an offer account and transferring offered tokens to escrow vault
- **take_offer**: Completes a trade by transferring escrowed tokens to taker and requested tokens from taker to maker
- **refund_offer**: Allows offer maker to cancel their offer and retrieve escrowed tokens from the vault

### Account Structure

```rust
#[account]
#[derive(InitSpace)]
pub struct Offer {
    /// Unique identifier for the offer (counter for each user)
    pub id: u64,

    /// The maker (offer creator)
    pub maker: Pubkey,

    /// The token mint being offered
    pub offered_mint: Pubkey,

    /// The token mint that maker is requesting
    pub requested_mint: Pubkey,

    /// Amount of offered tokens (with token decimals)
    pub offered_amount: u64,

    /// Amount of requested tokens (with token decimals)
    pub requested_amount: u64,

    /// PDA bump seed (for deriving vault PDA)
    pub bump: u8,
}
```

## Testing

### Test Coverage

The project includes comprehensive tests covering all core functionality with both successful operations and error conditions to ensure program security and reliability.

**Happy Path Tests:**

- **Make Offer**: Successfully creates offer account, transfers tokens to vault, and stores offer data
- **Take Offer**: Properly executes atomic swap by transferring tokens between maker and taker
- **Refund Offer**: Allows maker to cancel offer and retrieve escrowed tokens from vault

**Unhappy Path Tests:**

- **Insufficient Balance**: Fails when maker tries to create offer without enough tokens
- **Unauthorized Refund**: Fails when non-maker tries to refund someone else's offer
- **Invalid Token Mints**: Fails with invalid or non-existent token mint addresses
- **Duplicate Offer ID**: Fails when trying to create offer with existing ID for same maker

### Running Tests

```bash
npm run anchor-test     # Run Anchor program tests
```

### Additional Notes for Evaluators

This OTC trading platform demonstrates several key Solana development concepts including PDA usage for deterministic account creation, escrow mechanics for secure token holding, and atomic swaps for trustless trading. The frontend uses modern React patterns with TanStack Query for state management and Gill for type-safe Solana interactions. The project emphasizes security through proper account validation and error handling throughout the trading lifecycle.

---
description: Anchor Program Development Rules - Rust/Solana Best Practices
globs: "anchor_project/**/*.rs"
alwaysApply: true
---

# Anchor Program Development Rules

## Project Context

Deal-forge is a Decentralized Escrow Platform built on Solana using the Anchor framework. This guide ensures secure, efficient, and maintainable Rust code for the Anchor program handling escrow and settlement operations.

## Key Principles

- **Security First**: All financial operations must be secure and exploit-resistant
- **Efficient Resource Usage**: Minimize compute units and account space
- **Clear Error Handling**: Provide meaningful error messages for debugging
- **Comprehensive Testing**: Cover both happy and unhappy paths
- **PDA Usage**: Leverage Program Derived Addresses for secure account management

## Before Writing Code

1. Analyze existing patterns in the Anchor program (`anchor_project/programs/dealforge/src/`)
2. Consider security implications for financial operations
3. Plan account structures and PDA seeds carefully
4. Follow Solana program security best practices
5. Ensure proper access control and ownership checks
6. Consider cross-program invocation (CPI) requirements

## Core Rules

### Security and Access Control

- **Always verify signer authority**: Check that the correct account is signing transactions
- **Validate account ownership**: Ensure accounts belong to the expected programs
- **Use proper constraint macros**: Leverage Anchor's constraint system for validation
- **Check account initialization**: Verify accounts are in expected states
- **Prevent replay attacks**: Use proper nonce or timestamp validation
- **Validate numeric inputs**: Check for overflow, underflow, and division by zero
- **Implement proper authorization**: Ensure only authorized users can perform operations

### Account Management

- **Use Program Derived Addresses (PDAs)**: Leverage PDAs for secure, deterministic account generation
- **Design efficient account structures**: Minimize account size while maintaining functionality
- **Implement proper account initialization**: Use `init` constraints correctly
- **Handle account closure properly**: Use `close` constraint to reclaim rent
- **Validate account relationships**: Ensure accounts are properly related to each other

### Error Handling

- **Use custom error types**: Define meaningful error codes for different failure scenarios
- **Provide descriptive error messages**: Help developers understand what went wrong
- **Handle all error cases**: Don't leave any code paths that can panic
- **Use proper error propagation**: Use `?` operator and `Result` types consistently
- **Log relevant information**: Use `msg!` macro for debugging information

### Performance and Efficiency

- **Minimize compute unit usage**: Write efficient algorithms and avoid unnecessary operations
- **Optimize account space**: Use appropriate data types and packing
- **Avoid unnecessary heap allocations**: Prefer stack allocation where possible
- **Use efficient serialization**: Leverage Anchor's automatic serialization
- **Batch operations when possible**: Reduce transaction overhead

### Code Organization

- **Separate concerns**: Keep instruction logic, account validation, and business logic separate
- **Use meaningful names**: Choose clear, descriptive names for functions, accounts, and variables
- **Document public interfaces**: Add doc comments to all public functions and structs
- **Follow Rust conventions**: Use standard Rust naming and formatting conventions
- **Group related functionality**: Organize code into logical modules

## Anchor-Specific Patterns

### Instruction Structure

```rust
// ✅ Good: Well-structured instruction with proper validation
#[derive(Accounts)]
pub struct CreateTradeOrder<'info> {
    #[account(
        init,
        payer = user,
        space = TradeOrder::SIZE,
        seeds = [b"trade_order", user.key().as_ref(), &trade_id.to_le_bytes()],
        bump
    )]
    pub trade_order: Account<'info, TradeOrder>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        constraint = token_mint.decimals <= 9 @ ErrorCode::InvalidTokenDecimals
    )]
    pub token_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}

// ❌ Bad: Missing constraints and validation
#[derive(Accounts)]
pub struct CreateTradeOrder<'info> {
    pub trade_order: Account<'info, TradeOrder>,
    pub user: Signer<'info>,
    pub token_mint: Account<'info, Mint>,
}
```

### Error Handling

```rust
// ✅ Good: Custom error types with descriptive messages
#[error_code]
pub enum ErrorCode {
    #[msg("Trade amount must be greater than zero")]
    InvalidTradeAmount,

    #[msg("Trade order has expired")]
    TradeOrderExpired,
}

// Usage in instruction
pub fn create_trade_order(
    ctx: Context<CreateTradeOrder>,
    amount: u64,
    price: u64,
    expiry: i64,
) -> Result<()> {
    require!(amount > 0, ErrorCode::InvalidTradeAmount);
    require!(expiry > Clock::get()?.unix_timestamp, ErrorCode::TradeOrderExpired);

    ...

    msg!("Trade order created: amount={}, price={}", amount, price);

    Ok(())
}
```

### Account Structures

```rust
// ✅ Good: Well-documented account structure with proper sizing
#[account]
pub struct TradeOrder {
    /// The user who created this trade order
    pub creator: Pubkey,           // 32 bytes

    /// The token mint being traded
    pub token_mint: Pubkey,        // 32 bytes

    /// Amount of tokens to trade
    pub amount: u64,               // 8 bytes

    /// Price per token in lamports
    pub price: u64,                // 8 bytes

    /// Timestamp when this order expires
    pub expiry: i64,               // 8 bytes

    /// Current status of the trade order
    pub status: TradeStatus,       // 1 byte

    /// Optional counterparty (for direct trades)
    pub counterparty: Option<Pubkey>, // 33 bytes (1 + 32)

    /// Bump seed for PDA derivation
    pub bump: u8,                  // 1 byte
}

impl TradeOrder {
    pub const SIZE: usize = 8 + 32 + 32 + 8 + 8 + 8 + 1 + 33 + 1; // 131 bytes + discriminator
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum TradeStatus {
    Open,
    Filled,
    Cancelled,
    Expired,
}
```

### Security Patterns

```rust
// ✅ Good: Proper access control and validation
pub fn cancel_trade_order(ctx: Context<CancelTradeOrder>) -> Result<()> {
    let trade_order = &mut ctx.accounts.trade_order;

    // Verify only creator or admin can cancel
    require!(
        trade_order.creator == ctx.accounts.user.key() ||
        ctx.accounts.user.key() == ADMIN_PUBKEY,
        ErrorCode::UnauthorizedCancellation
    );

    // Verify order is in cancellable state
    require!(
        trade_order.status == TradeStatus::Open,
        ErrorCode::TradeOrderNotCancellable
    );

    trade_order.status = TradeStatus::Cancelled;

    emit!(TradeOrderCancelled {
        trade_order: trade_order.key(),
        creator: trade_order.creator,
    });

    Ok(())
}

// ❌ Bad: Missing access control
pub fn cancel_trade_order(ctx: Context<CancelTradeOrder>) -> Result<()> {
    let trade_order = &mut ctx.accounts.trade_order;
    trade_order.status = TradeStatus::Cancelled;
    Ok(())
}
```

## Common Anti-Patterns to Avoid

### Security Issues

```rust
// ❌ Bad: Missing signer check
pub fn transfer_funds(ctx: Context<TransferFunds>, amount: u64) -> Result<()> {
    // Missing: verify ctx.accounts.from.is_signer
    transfer_tokens(ctx, amount)
}

// ❌ Bad: No overflow protection
pub fn calculate_total(price: u64, amount: u64) -> u64 {
    price * amount // Can overflow
}

// ❌ Bad: Hardcoded values
const ADMIN_KEY: &str = "11111111111111111111111111111112";
```

### Performance Issues

```rust
// ❌ Bad: Inefficient account structure
#[account]
pub struct BadTradeOrder {
    pub data: Vec<String>, // Dynamic allocation on heap
    pub metadata: HashMap<String, String>, // Not serializable by Anchor
}

// ❌ Bad: Unnecessary computation
pub fn process_trade(ctx: Context<ProcessTrade>) -> Result<()> {
    for i in 0..1000 { // Wastes compute units
        msg!("Processing step {}", i);
    }
    Ok(())
}
```

## Development Workflow

1. **Design Phase**: Plan account structures and instruction flow
2. **Implementation**: Write secure, efficient Rust code following these rules
3. **Testing**: Create comprehensive tests for all scenarios
4. **Code Review**: Verify security and efficiency
5. **Deployment**: Test on devnet before mainnet deployment

## Tools and Commands

- `anchor build` - Build the program and generate IDL
- `anchor test` - Run Anchor tests with local validator
- `anchor deploy --provider.cluster devnet` - Deploy to devnet
- `cargo clippy` - Run Rust linter for additional checks
- `cargo audit` - Check for known security vulnerabilities

# Project Architecture Guide

This file provides guidance when working with the Deal-forge Decentralized Escrow Platform codebase.

## Project Overview

Deal-forge is a Decentralized Escrow Platform built as a Solana dApp with Next.js 15, featuring:

- **Core Trading Program**: Rust-based Solana program using Anchor framework for Escrow
- **Modern Frontend**: TypeScript with Next.js 15, Radix UI components, and Tailwind CSS
- **Wallet Integration**: Seamless connection via Gill (@wallet-ui/react) for transaction signing
- **Type-Safe Client**: Auto-generated TypeScript client via Codama from Anchor IDL
- **Real-time Updates**: React Query for caching and state synchronization
- **Professional UI**: shadcn/ui components with accessibility standards

## Development Commands

### Core Development

- `npm run dev` - Start Next.js development server with Turbopack
- `npm run build` - Build the Next.js application
- `npm run check` - Format and lint code with Biome (via Ultracite)
- `npm run ci` - Run complete CI pipeline (build + lint + check + codama)

### Anchor/Solana Program

- `npm run anchor-build` - Build the Anchor program
- `npm run anchor-localnet` - Start local validator with deployed program
- `npm run anchor-test` - Run Anchor program tests
- `npm run setup` - Sync program keypairs and generate client code
- `npm run codama:js` - Generate TypeScript client from IDL using Codama

### Testing

- Use `vitest` for testing (configured with globals enabled)
- Anchor tests run via `anchor test` command

## Architecture

### Directory Structure

```
├── anchor_project/                     # Solana program (Rust)
│   ├── programs/dealforge/     # Escrow program source
│   │   └── src/lib.rs          # Main program with trading instructions
│   ├── src/                    # Generated TypeScript client
│   │   ├── client/js/generated/    # Auto-generated client code
│   │   └── dealforge-exports.ts    # Program exports
│   └── tests/                  # Anchor program tests
├── src/
│   ├── app/                    # Next.js 15 app router pages
│   │   ├── dealforge/          # Trading interface pages
│   │   ├── account/            # User account management
│   │   └── layout.tsx          # Root layout with providers
│   ├── components/             # React components
│   │   ├── dealforge/          # Trading-specific components
│   │   │   └── dealforge-data-access.tsx  # Program interaction hooks
│   │   ├── solana/             # Wallet/blockchain utilities
│   │   ├── ui/                 # shadcn/ui base components
│   │   └── app-*.tsx           # Application shell components
│   └── lib/                    # Utility functions and configurations
```

### Key Technologies

- **Anchor Framework**: Solana program development with IDL generation
- **Gill**: Solana dApp utilities and Codama configuration
- **Codama**: Generates TypeScript client from Anchor IDL
- **@wallet-ui/react**: Wallet connection and UI components
- **Next.js 15**: React framework with app router
- **Radix UI + Tailwind**: Component library and styling
- **React Query**: Data fetching and state management
- **Zustand**: State management library
- **Zod**: Runtime type validation
- **Biome + Ultracite**: Ultra-fast linting, formatting, and code quality enforcement

### TypeScript Configuration

- Path aliases: `@/*` for src, `@project/anchor` for generated client
- Strict mode with strict null checks enabled
- Next.js optimizations and Vitest globals enabled

### Code Generation Workflow

1. Modify Anchor program in `anchor_project/programs/dealforge/src/lib.rs`
2. Run `npm run anchor-build` to build program and generate IDL
3. Run `npm run codama:js` to generate TypeScript client
4. Import generated functions from `@project/anchor` in React components

### Solana Program Integration

- Program ID managed via Anchor.toml and updated by `npm run setup`
- Client code generated in `anchor_project/src/client/js/generated/`
- React hooks in `dealforge-data-access.tsx` handle program interactions
- Transaction signing and sending managed by wallet utilities

### Styling and UI

- Tailwind CSS with custom configuration
- shadcn/ui components following "new-york" style
- Theme switching supported via next-themes
- Component variants managed with class-variance-authority

### Development Setup

1. Run `npm run setup` to sync program keys and generate client code
2. Use `npm run anchor-localnet` for local Solana development
3. Deploy to devnet with `anchor deploy --provider.cluster devnet`

### Code Quality and Formatting

- **Ultracite**: Enforces strict type safety, accessibility standards, and consistent code quality
- **Biome**: Lightning-fast formatter and linter with zero configuration
- **Lefthook + lint-staged**: Git hooks for automated code quality checks
- Use `npm run check` to format and fix code automatically
- Pre-commit hooks run `ultracite fix` on staged files

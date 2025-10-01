# Autumn Brew POS — Champagne Theme

Elegant, fall-themed point-of-sale web app for cashiers. This frontend connects to Supabase for menu, orders, and inventory.

## Quick start
- Copy `.env.example` to `.env` and set:
  - `REACT_APP_SUPABASE_URL`
  - `REACT_APP_SUPABASE_KEY`
- Install and run:
  - `npm install`
  - `npm start`

If env vars are not set, the app runs with demo in-memory data for Menu, Orders, and Inventory (read-only).

## Features
- Menu browsing with categories and search
- Order building with cart, automatic totals and tax
- Checkout flow to create and pay orders
- Inventory view with quantity adjustments
- Champagne elegant UI: soft amber gradient, refined rounded cards, subtle shadows

## Theme (Champagne)
- Primary: `#D97706`
- Secondary: `#F3F4F6`
- Background: `#FFFBEB`
- Surface: `#FFFFFF`
- Text: `#374151`

## Supabase schema
Create these tables (names can be customized if you update service queries):
- `menu_items(id uuid pk, name text, price_cents int, category text, in_stock bool, sku text, image_url text)`
- `orders(id uuid pk, created_at timestamp default now(), status text, total_cents int)`
- `order_items(id uuid pk, order_id uuid fk, item_id uuid fk, quantity int, line_total_cents int)`
- `inventory(id uuid pk, sku text, name text, quantity int, updated_at timestamp default now())`

Enable Row Level Security (RLS) according to your security needs and policies.

## Scripts
- `npm start` — dev server
- `npm run build` — production build
- `npm test` — tests

## Notes
- Payment flow is simplified: paying marks an order as `paid`.
- This is a cashier-facing UI and does not implement authentication; add Supabase Auth as needed.

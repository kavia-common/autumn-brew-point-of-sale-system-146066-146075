# Autumn Brew POS — Champagne Theme

Elegant, fall-themed point-of-sale web app for cashiers. This frontend connects to Supabase for menu, orders, and inventory.

## Quick start
- Create `.env` and set:
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

## Supabase schema (applied)
The project has been configured with:
- `menu_items(id uuid pk default gen_random_uuid(), name text, price_cents int, category text, in_stock bool, sku text, image_url text)`
- `orders(id uuid pk default gen_random_uuid(), created_at timestamptz default now(), status text default 'open', total_cents int)`
- `order_items(id uuid pk default gen_random_uuid(), order_id uuid fk -> orders.id on delete cascade, item_id uuid fk -> menu_items.id, quantity int, line_total_cents int)`
- `inventory(id uuid pk default gen_random_uuid(), sku text, name text, quantity int, updated_at timestamptz default now())`

RLS is enabled and permissive kiosk policies are installed (allowing anon select/insert/update as described in assets/supabase.md). For production, tighten policies.

## URL configuration and auth redirects
If you later add Supabase Auth:
- In Supabase Dashboard > Authentication > URL Configuration
  - Site URL: your production domain
  - Redirect URLs:
    - http://localhost:3000/**
    - https://yourapp.com/**
- Use a dynamic URL helper (see assets/supabase.md guidance) to set emailRedirectTo/redirectTo.

## Scripts
- `npm start` — dev server
- `npm run build` — production build
- `npm test` — tests

## Notes
- Payment flow is simplified: paying marks an order as `paid`.
- This is a cashier-facing UI and does not implement authentication; add Supabase Auth as needed.

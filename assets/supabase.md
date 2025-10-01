# Supabase Integration Guide — Autumn Brew POS

This frontend uses Supabase for menu, orders, and inventory. Configure environment variables and create tables as described.

## Environment Variables
Create `.env` in the frontend root with:
- REACT_APP_SUPABASE_URL=<your-project-url>
- REACT_APP_SUPABASE_KEY=<anon-or-service-key>

Do not commit `.env`.

## Tables
- menu_items(id uuid pk, name text, price_cents int, category text, in_stock bool, sku text, image_url text)
- orders(id uuid pk, created_at timestamp default now(), status text, total_cents int)
- order_items(id uuid pk, order_id uuid fk -> orders.id, item_id uuid fk -> menu_items.id, quantity int, line_total_cents int)
- inventory(id uuid pk, sku text, name text, quantity int, updated_at timestamp default now())

## Policies
Lock down anonymous access suitable for your environment. For a simple cashier kiosk with no auth, you can allow insert/select/update on these tables but ensure network isolation.

## Email Redirect (if adding Auth)
When adding user signup flows, set emailRedirectTo using SITE_URL mapped to REACT_APP_SITE_URL in environment.

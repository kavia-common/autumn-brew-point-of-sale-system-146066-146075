# Supabase Integration Guide — Autumn Brew POS

This frontend uses Supabase for menu, orders, and inventory. Configure environment variables and create tables as described.

Last configured: [auto] via Supabase configuration agent

## Environment Variables
Create `.env` in the frontend root with:
- REACT_APP_SUPABASE_URL=<your-project-url>
- REACT_APP_SUPABASE_KEY=<anon-or-service-key>

Do not commit `.env`.

Note: container_env currently exposes REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY. Ensure they are set before switching off demo mode in the UI.

## Database Schema (Applied)
The following tables, constraints, and policies were created in your Supabase project (public schema):

Tables
- menu_items
  - id uuid primary key default gen_random_uuid()
  - name text not null
  - price_cents integer not null default 0
  - category text
  - in_stock boolean not null default true
  - sku text
  - image_url text

- orders
  - id uuid primary key default gen_random_uuid()
  - created_at timestamp with time zone not null default now()
  - status text not null default 'open'
  - total_cents integer not null default 0

- order_items
  - id uuid primary key default gen_random_uuid()
  - order_id uuid not null references orders(id) on delete cascade
  - item_id uuid not null references menu_items(id) on delete restrict
  - quantity integer not null default 1
  - line_total_cents integer not null default 0

- inventory
  - id uuid primary key default gen_random_uuid()
  - sku text
  - name text not null
  - quantity integer not null default 0
  - updated_at timestamp with time zone not null default now()

Indexes
- idx_order_items_order_id on order_items(order_id)
- idx_order_items_item_id on order_items(item_id)
- idx_menu_items_category on menu_items(category)
- idx_inventory_sku on inventory(sku)

Row Level Security
RLS is enabled on all four tables:
- alter table public.menu_items enable row level security;
- alter table public.orders enable row level security;
- alter table public.order_items enable row level security;
- alter table public.inventory enable row level security;

Policies (permissive kiosk/demo — revise for production)
- menu_items
  - menu_items_read: FOR SELECT USING (true)
  - menu_items_write: FOR INSERT WITH CHECK (true)
  - menu_items_update: FOR UPDATE USING (true)

- orders
  - orders_crud: FOR ALL USING (true) WITH CHECK (true)

- order_items
  - order_items_crud: FOR ALL USING (true) WITH CHECK (true)

- inventory
  - inventory_read: FOR SELECT USING (true)
  - inventory_update: FOR UPDATE USING (true)
  - inventory_insert: FOR INSERT WITH CHECK (true)

Security note:
These policies allow anonymous CRUD access. For kiosk deployments without authentication, ensure your network restricts access to the Supabase API key and/or replace with authenticated policies (e.g., auth.uid() based) before exposing publicly.

## Frontend Integration
The frontend service layer (src/services/posApi.js) expects these exact table names and columns. After env vars are set:
- Menu: reads from menu_items (optional filters: category, name ilike)
- Orders: creates into orders then inserts into order_items; updates orders.status to 'paid'
- Inventory: lists from inventory; updates quantity via update by id

Environment variable checks:
- src/services/supabaseClient.js exposes isSupabaseConfigured() and getSupabaseClient(). If variables are missing, the UI uses demo in-memory data.

## Recommended Admin Setup
1) Authentication (optional for this kiosk)
- If you add Auth later, configure Authentication > URL Configuration
  - Site URL: your production domain
  - Redirect URLs: 
    - http://localhost:3000/**
    - https://yourapp.com/**
- Ensure all auth flows use dynamic redirect URLs (see README guidance)

2) Email templates (optional)
- Adjust templates to use SiteURL/RedirectTo variables

3) Secrets
- Store service role keys outside the client. The frontend must only use the anon key.

## SQL Reference
In case you need to re-apply manually, here is the summarized SQL:

- Primary keys:
  alter table public.menu_items add primary key (id);
  alter table public.orders add primary key (id);
  alter table public.order_items add primary key (id);
  alter table public.inventory add primary key (id);

- Foreign keys and indexes:
  alter table public.order_items
    add constraint order_items_order_id_fkey foreign key (order_id) references public.orders(id) on delete cascade;
  alter table public.order_items
    add constraint order_items_item_id_fkey foreign key (item_id) references public.menu_items(id) on delete restrict;
  create index idx_order_items_order_id on public.order_items(order_id);
  create index idx_order_items_item_id on public.order_items(item_id);
  create index idx_menu_items_category on public.menu_items(category);
  create index idx_inventory_sku on public.inventory(sku);

- RLS enable:
  alter table public.menu_items enable row level security;
  alter table public.orders enable row level security;
  alter table public.order_items enable row level security;
  alter table public.inventory enable row level security;

- Policies (permissive):
  create policy menu_items_read on public.menu_items for select using (true);
  create policy menu_items_write on public.menu_items for insert with check (true);
  create policy menu_items_update on public.menu_items for update using (true);
  create policy orders_crud on public.orders for all using (true) with check (true);
  create policy order_items_crud on public.order_items for all using (true) with check (true);
  create policy inventory_read on public.inventory for select using (true);
  create policy inventory_update on public.inventory for update using (true);
  create policy inventory_insert on public.inventory for insert with check (true);

## Testing
- With env vars set, the app should:
  - Menu: show items from menu_items
  - Checkout: create orders and order_items, then update orders to 'paid'
  - Inventory: list and adjust inventory quantities

If env vars are not set, the UI operates in demo mode with in-memory sample data.

## Troubleshooting
- If you receive RLS errors, confirm policies above exist and that the anon key is used.
- If foreign key errors occur on order creation, ensure menu_items contains the items referenced by their UUIDs before creating orders.
- Never expose your service role key in the frontend.

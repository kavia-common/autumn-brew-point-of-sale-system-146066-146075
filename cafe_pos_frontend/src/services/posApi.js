/**
 * POS API Service using Supabase to manage menu items, orders, and inventory.
 * The expected tables (create in your Supabase project):
 *
 * - menu_items: { id (uuid), name (text), price_cents (int), category (text), in_stock (bool), sku (text), image_url (text) }
 * - orders: { id (uuid), created_at (timestamp), status (text: 'open'|'paid'|'refunded'), total_cents (int) }
 * - order_items: { id (uuid), order_id (uuid) -> orders.id, item_id (uuid) -> menu_items.id, quantity (int), line_total_cents (int) }
 * - inventory: { id (uuid), sku (text), name (text), quantity (int), updated_at (timestamp) }
 */
import { getSupabaseClient } from './supabaseClient';

const PAGE_SIZE = 50;

function getClientOrThrow() {
  const c = getSupabaseClient();
  if (!c) throw new Error('Supabase not configured');
  return c;
}

// PUBLIC_INTERFACE
export async function fetchMenuItems({ category, search } = {}) {
  /** Fetch menu items with optional category and text search. */
  const supabase = getClientOrThrow();
  let query = supabase.from('menu_items').select('*').order('name', { ascending: true });

  if (category && category !== 'All') query = query.eq('category', category);
  if (search && search.trim()) query = query.ilike('name', `%${search.trim()}%`);

  const { data, error } = await query.limit(PAGE_SIZE);
  if (error) throw error;
  return data || [];
}

// PUBLIC_INTERFACE
export async function fetchOpenOrders() {
  /** Fetch recent open orders for cashier review. */
  const supabase = getClientOrThrow();
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, menu_items(name, price_cents))')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

// PUBLIC_INTERFACE
export async function createOrder(cartItems) {
  /**
   * Create an order with line items.
   * cartItems: [{ id, name, price_cents, quantity }]
   */
  const supabase = getClientOrThrow();

  const total_cents = cartItems.reduce((sum, it) => sum + (it.price_cents * it.quantity), 0);
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert([{ status: 'open', total_cents }])
    .select()
    .single();
  if (orderErr) throw orderErr;

  const orderItemsPayload = cartItems.map(ci => ({
    order_id: order.id,
    item_id: ci.id,
    quantity: ci.quantity,
    line_total_cents: ci.price_cents * ci.quantity
  }));

  const { error: itemsErr } = await supabase.from('order_items').insert(orderItemsPayload);
  if (itemsErr) throw itemsErr;

  return order;
}

// PUBLIC_INTERFACE
export async function payOrder(orderId) {
  /** Mark an order as paid. */
  const supabase = getClientOrThrow();
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'paid' })
    .eq('id', orderId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function fetchInventory({ search } = {}) {
  /** Retrieve inventory items. */
  const supabase = getClientOrThrow();
  let query = supabase.from('inventory').select('*').order('name', { ascending: true }).limit(PAGE_SIZE);
  if (search && search.trim()) query = query.ilike('name', `%${search.trim()}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// PUBLIC_INTERFACE
export async function adjustInventory(id, delta) {
  /** Atomically adjust inventory quantity by delta (+/-). */
  const supabase = getClientOrThrow();

  // Get current
  const { data: current, error: curErr } = await supabase.from('inventory').select('*').eq('id', id).single();
  if (curErr) throw curErr;
  const quantity = Math.max(0, (current?.quantity || 0) + delta);

  const { data, error } = await supabase.from('inventory').update({ quantity }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

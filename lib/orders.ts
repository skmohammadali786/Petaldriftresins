import { d1Query, isD1Configured } from '@/lib/d1';
import { getProducts } from '@/lib/products';
import type { OrderRecord, TrackingEvent, TrackingStatus } from '@/lib/site-content';

type OrderRow = Omit<OrderRecord, 'events' | 'items'> & { events: string; items: string };

type CreateOrderInput = {
  accountName: string;
  accountEmail: string;
  shippingAddress: string;
  items: Array<{ slug: string; quantity: number; name?: string; unitPrice?: number; customDetails?: string }>;
};

const memoryOrders = new Map<string, OrderRecord>();

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

async function ensureOrdersTable() {
  if (!isD1Configured()) return;
  await d1Query(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    account_name TEXT NOT NULL,
    account_email TEXT NOT NULL,
    created_at TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL,
    courier TEXT NOT NULL,
    tracking_number TEXT NOT NULL,
    events TEXT NOT NULL,
    items TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
}

function rowToOrder(row: OrderRow & { account_name?: string; account_email?: string; created_at?: string; tracking_number?: string; shipping_address?: string }): OrderRecord {
  return {
    id: row.id,
    accountName: row.accountName ?? row.account_name ?? '',
    accountEmail: row.accountEmail ?? row.account_email ?? '',
    createdAt: row.createdAt ?? row.created_at ?? '',
    total: Number(row.total) || 0,
    status: row.status as TrackingStatus,
    courier: row.courier,
    trackingNumber: row.trackingNumber ?? row.tracking_number ?? '',
    events: JSON.parse(row.events || '[]') as OrderRecord['events'],
    items: JSON.parse(row.items || '[]') as OrderRecord['items'],
    shippingAddress: row.shippingAddress ?? row.shipping_address ?? ''
  };
}

async function saveOrder(order: OrderRecord) {
  if (isD1Configured()) {
    await ensureOrdersTable();
    await d1Query(
      `INSERT INTO orders (id, account_name, account_email, created_at, total, status, courier, tracking_number, events, items, shipping_address, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET
       account_name = excluded.account_name,
       account_email = excluded.account_email,
       total = excluded.total,
       status = excluded.status,
       courier = excluded.courier,
       tracking_number = excluded.tracking_number,
       events = excluded.events,
       items = excluded.items,
       shipping_address = excluded.shipping_address,
       updated_at = CURRENT_TIMESTAMP`,
      [order.id, order.accountName, order.accountEmail, order.createdAt, order.total, order.status, order.courier, order.trackingNumber, JSON.stringify(order.events), JSON.stringify(order.items), order.shippingAddress]
    );
    return;
  }
  memoryOrders.set(order.id, order);
}

export async function createOrder(input: CreateOrderInput) {
  if (!input.accountName.trim() || !input.accountEmail.trim() || !input.shippingAddress.trim() || input.items.length === 0) {
    throw new Error('Name, email, address, and at least one cart item are required.');
  }

  const products = await getProducts();
  const orderItems = input.items.flatMap((line) => {
    const product = products.find((entry) => entry.slug === line.slug);
    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1));
    if (!product) {
      if (!line.name?.trim()) return [];
      return [{ slug: line.slug || uid('custom'), name: line.name.trim(), quantity, unitPrice: Number(line.unitPrice) || 0, customDetails: line.customDetails?.trim() }];
    }
    const unitPrice = Number(product.price.replace(/[^0-9.]/g, '')) || 0;
    return [{ slug: product.slug, name: product.name, quantity, unitPrice, customDetails: line.customDetails?.trim() }];
  });

  if (orderItems.length === 0) throw new Error('No valid products found in cart.');

  const firstEvent: TrackingEvent = {
    id: uid('evt'),
    status: 'Order placed',
    note: 'Order confirmed by storefront checkout.',
    timestamp: new Date().toISOString()
  };

  const order: OrderRecord = {
    id: uid('ord'),
    accountName: input.accountName.trim(),
    accountEmail: input.accountEmail.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
    total: orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    status: 'Order placed',
    courier: 'Pending assignment',
    trackingNumber: 'TBD',
    events: [firstEvent],
    items: orderItems,
    shippingAddress: input.shippingAddress.trim()
  };

  await saveOrder(order);
  return order;
}

export async function getOrders(email?: string) {
  if (isD1Configured()) {
    await ensureOrdersTable();
    const rows = email
      ? await d1Query<OrderRow & { account_name: string; account_email: string; created_at: string; tracking_number: string; shipping_address: string }>('SELECT id, account_name, account_email, created_at, total, status, courier, tracking_number, events, items, shipping_address FROM orders WHERE account_email = ? ORDER BY created_at DESC', [email.toLowerCase()])
      : await d1Query<OrderRow & { account_name: string; account_email: string; created_at: string; tracking_number: string; shipping_address: string }>('SELECT id, account_name, account_email, created_at, total, status, courier, tracking_number, events, items, shipping_address FROM orders ORDER BY created_at DESC');
    return rows.map(rowToOrder);
  }
  const orders = Array.from(memoryOrders.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return email ? orders.filter((order) => order.accountEmail === email.toLowerCase()) : orders;
}

export async function updateOrderTracking(input: { orderId: string; status: TrackingStatus; note: string; courier: string; trackingNumber: string }) {
  const order = (await getOrders()).find((entry) => entry.id === input.orderId);
  if (!order) throw new Error('Order not found.');
  const event: TrackingEvent = {
    id: uid('evt'),
    status: input.status,
    note: input.note.trim() || 'Tracking updated from admin panel.',
    timestamp: new Date().toISOString()
  };
  const updated: OrderRecord = {
    ...order,
    status: input.status,
    courier: input.courier.trim() || order.courier,
    trackingNumber: input.trackingNumber.trim() || order.trackingNumber,
    events: [event, ...order.events]
  };
  await saveOrder(updated);
  return updated;
}

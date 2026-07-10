import { NextRequest, NextResponse } from 'next/server';
import { CUSTOMER_COOKIE_NAME, getCustomerFromCookie } from '@/lib/customer-auth';
import { createOrder, getOrders } from '@/lib/orders';

export async function GET(request: NextRequest) {
  const customer = await getCustomerFromCookie(request.cookies.get(CUSTOMER_COOKIE_NAME)?.value);
  if (!customer) return NextResponse.json({ error: 'Customer login required.' }, { status: 401 });
  const orders = await getOrders(customer.email);
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  try {
    const customer = await getCustomerFromCookie(request.cookies.get(CUSTOMER_COOKIE_NAME)?.value);
    const payload = await request.json() as { name?: string; email?: string; address?: string; items?: Array<{ slug: string; quantity: number }> };
    const order = await createOrder({
      accountName: customer?.name ?? payload.name ?? '',
      accountEmail: customer?.email ?? payload.email ?? '',
      shippingAddress: payload.address ?? '',
      items: payload.items ?? []
    });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

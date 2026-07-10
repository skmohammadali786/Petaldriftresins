import { NextRequest, NextResponse } from 'next/server';
import { loginCustomer, setCustomerSession } from '@/lib/customer-auth';

export async function POST(request: NextRequest) {
  try {
    const account = await loginCustomer(await request.json());
    await setCustomerSession(account);
    return NextResponse.json({ user: account, authenticated: true, provider: 'Cloudflare D1 Customer Auth' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

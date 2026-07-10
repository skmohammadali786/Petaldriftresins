import { NextRequest, NextResponse } from 'next/server';
import { signupCustomer, setCustomerSession } from '@/lib/customer-auth';

export async function POST(request: NextRequest) {
  try {
    const account = await signupCustomer(await request.json());
    await setCustomerSession(account);
    return NextResponse.json({ user: account, authenticated: true, provider: 'Cloudflare D1 Customer Auth' });
  } catch (error) {
    const message = (error as Error).message;
    return NextResponse.json({ error: message.includes('UNIQUE') ? 'An account with this email already exists.' : message }, { status: 400 });
  }
}

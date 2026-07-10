import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/cloudflare';
import { CUSTOMER_COOKIE_NAME, getCustomerFromCookie } from '@/lib/customer-auth';

export async function GET(request: NextRequest) {
  const accessUser = await getCurrentUser(request.headers);
  const customer = await getCustomerFromCookie(request.cookies.get(CUSTOMER_COOKIE_NAME)?.value);
  const user = customer ?? accessUser;
  return NextResponse.json({
    user,
    provider: customer ? 'Cloudflare D1 Customer Auth' : 'Cloudflare Access',
    authenticated: Boolean(user)
  });
}

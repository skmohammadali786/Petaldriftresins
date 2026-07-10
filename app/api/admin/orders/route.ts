import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getOrders, updateOrderTracking } from '@/lib/orders';
import { trackingStatuses, type TrackingStatus } from '@/lib/site-content';

function isTrackingStatus(value: string): value is TrackingStatus {
  return trackingStatuses.includes(value as TrackingStatus);
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request.headers);
    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    const message = (error as Error).message;
    return NextResponse.json({ error: message }, { status: message.includes('Admin access required') ? 401 : 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin(request.headers);
    const payload = await request.json() as { orderId?: string; status?: string; note?: string; courier?: string; trackingNumber?: string };
    if (!payload.orderId || !payload.status || !isTrackingStatus(payload.status)) {
      return NextResponse.json({ error: 'Valid orderId and tracking status are required.' }, { status: 400 });
    }
    const updated = await updateOrderTracking({
      orderId: payload.orderId,
      status: payload.status,
      note: payload.note ?? '',
      courier: payload.courier ?? '',
      trackingNumber: payload.trackingNumber ?? ''
    });
    const orders = await getOrders();
    return NextResponse.json({ order: updated, orders });
  } catch (error) {
    const message = (error as Error).message;
    return NextResponse.json({ error: message }, { status: message.includes('Admin access required') ? 401 : 500 });
  }
}

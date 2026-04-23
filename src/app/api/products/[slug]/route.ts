import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const adminPassword = request.headers.get('x-admin-password');
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }

  const { slug } = await params;
  try {
    const db = getFirestore();
    await db.collection('products/de/items').doc(slug).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Löschen fehlgeschlagen', details: String(error) },
      { status: 500 }
    );
  }
}

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

export async function PUT(
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
    const updates = await request.json();
    
    // Safety check, don't update ID or created dates
    delete updates.id;
    delete updates.createdAt;
    
    updates.updatedAt = new Date().toISOString();

    await db.collection('products/de/items').doc(slug).update(updates);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Aktualisierung fehlgeschlagen', details: String(error) },
      { status: 500 }
    );
  }
}

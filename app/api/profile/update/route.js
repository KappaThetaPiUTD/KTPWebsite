import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';

export async function POST(request) {
  try {
    const body = await request.json();
  const { id, name, graduation_date, phone } = body;
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

    const upd = {};
  // Only allow updating non-privileged fields from client
  if (name !== undefined) upd.name = name;
  if (graduation_date !== undefined) upd.graduation_date = graduation_date;
  if (phone !== undefined) upd.phone = phone;

    const { data, error } = await supabaseServer
      .from('users')
      .update(upd)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Server update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Unexpected server error updating profile:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

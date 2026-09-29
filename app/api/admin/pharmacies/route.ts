import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Accès admin requis' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('pharmacies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ pharmacies: data ?? [] });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Accès admin requis' }, { status: 403 });
  }

  const body = await request.json();
  const { pharmacyId, status, note } = body as {
    pharmacyId?: string;
    status?: 'approved' | 'rejected';
    note?: string;
  };

  if (!pharmacyId || !status || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 });
  }

  const { data: pharmacy, error: updateError } = await supabase
    .from('pharmacies')
    .update({
      status,
      validated_at: new Date().toISOString(),
    })
    .eq('id', pharmacyId)
    .select()
    .single();

  if (updateError || !pharmacy) {
    return NextResponse.json({ error: updateError?.message ?? 'Pharmacie introuvable' }, { status: 400 });
  }

  const { error: reviewError } = await supabase
    .from('pharmacy_reviews')
    .insert({
      pharmacy_id: pharmacyId,
      reviewer_id: user.id,
      decision: status,
      note: note ?? '',
    });

  if (reviewError) {
    return NextResponse.json({ error: reviewError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, pharmacy });
}

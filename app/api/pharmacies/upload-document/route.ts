import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const pharmacyId = String(formData.get('pharmacyId') ?? '');
  const type = String(formData.get('type') ?? 'license');

  if (!file || !pharmacyId) {
    return NextResponse.json({ error: 'Fichier ou pharmacie manquant' }, { status: 400 });
  }

  const safeName = `${user.id}/${pharmacyId}/${type}-${Date.now()}-${file.name}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('pharmacy-documents')
    .upload(safeName, file, { upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data: publicUrlData } = supabase.storage
    .from('pharmacy-documents')
    .getPublicUrl(uploadData.path);

  const { error: insertError } = await supabase.from('pharmacy_documents').insert({
    pharmacy_id: pharmacyId,
    type,
    file_url: publicUrlData.publicUrl,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ url: publicUrlData.publicUrl });
}

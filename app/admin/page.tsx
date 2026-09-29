import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminPharmacyClient from './admin-client';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?role=pharmacien');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'admin') {
    redirect('/');
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <AdminPharmacyClient />
    </main>
  );
}

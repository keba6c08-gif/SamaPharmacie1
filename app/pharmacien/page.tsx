import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PharmacienDashboard from './dashboard-client';

export default async function PharmacienPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata.role !== 'pharmacien') {
    redirect('/login?role=pharmacien');
  }

  return (
    <PharmacienDashboard
      pharmacyName={user.user_metadata.pharmacy_name || 'Ma pharmacie'}
      ownerName={user.user_metadata.full_name || user.email || 'Pharmacien'}
      email={user.email || ''}
      pharmacyId={user.id}
      pharmacyAddress={user.user_metadata.pharmacy_address || ''}
      pharmacyCity={user.user_metadata.pharmacy_city || ''}
      verificationStatus={user.user_metadata.verification_status === 'verified' ? 'verified' : 'pending'}
    />
  );
}
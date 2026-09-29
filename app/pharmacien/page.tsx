import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PharmacienDashboard from './dashboard-client';

export default async function PharmacienPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata.role !== 'pharmacien') {
    redirect('/login?role=pharmacien');
  }

  const { data: pharmacy } = await supabase
    .from('pharmacies')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  const pharmacyName = pharmacy?.name || user.user_metadata.pharmacy_name || 'Ma pharmacie';
  const ownerName = user.user_metadata.full_name || user.email || 'Pharmacien';
  const pharmacyAddress = pharmacy?.address || user.user_metadata.pharmacy_address || '';
  const pharmacyCity = pharmacy?.city || user.user_metadata.pharmacy_city || '';
  const verificationStatus = pharmacy?.status === 'approved' ? 'verified' : 'pending';

  return (
    <PharmacienDashboard
      pharmacyName={pharmacyName}
      ownerName={ownerName}
      email={user.email || ''}
      pharmacyId={pharmacy?.id || user.id}
      pharmacyAddress={pharmacyAddress}
      pharmacyCity={pharmacyCity}
      verificationStatus={verificationStatus}
    />
  );
}
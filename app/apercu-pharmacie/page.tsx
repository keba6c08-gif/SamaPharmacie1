import PharmacienDashboard from '../pharmacien/dashboard-client';

export default function PharmacienPreviewPage() {
  return (
    <PharmacienDashboard
      pharmacyName="Pharmacie du Plateau"
      ownerName="Aïssatou Ndiaye"
      email="pharmacienne@demo.test"
      pharmacyId="pharmacy-preview"
      pharmacyAddress="Avenue Léopold Sédar Senghor"
      pharmacyCity="Dakar"
      verificationStatus="pending"
      preview
    />
  );
}
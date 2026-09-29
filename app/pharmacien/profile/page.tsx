import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import UploadForm from './upload-form';

export default async function PharmacienProfilePage() {
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

  const { data: documents } = await supabase
    .from('pharmacy_documents')
    .select('*')
    .eq('pharmacy_id', pharmacy?.id ?? '')
    .order('uploaded_at', { ascending: false });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Profil pharmacie</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">{pharmacy?.name ?? 'Pharmacie non enregistrée'}</h1>
          </div>
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            {pharmacy?.status ?? 'pending'}
          </span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Adresse</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{pharmacy?.address ?? 'Non renseignée'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Ville</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{pharmacy?.city ?? 'Non renseignée'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Téléphone</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{pharmacy?.phone ?? 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{pharmacy?.email ?? 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">N° inscription à l’Ordre</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{pharmacy?.pharmacist_registration_number ?? 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">N° autorisation pharmacie</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{pharmacy?.pharmacy_authorization_number ?? 'Non renseigné'}</p>
          </div>
        </div>

        {pharmacy?.logo_url && (
          <div className="mt-8">
            <p className="text-sm text-slate-500">Logo</p>
            <img src={pharmacy.logo_url} alt={pharmacy.name} className="mt-2 h-24 w-24 rounded-lg border border-slate-200 object-cover" />
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-lg font-semibold text-slate-900">Téléverser un logo</h2>
            <p className="mt-1 text-sm text-slate-600">Ajoutez l’image de votre pharmacie.</p>
            <div className="mt-4">
              <UploadForm pharmacyId={pharmacy?.id ?? user.id} uploadType="logo" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-lg font-semibold text-slate-900">Téléverser un document</h2>
            <p className="mt-1 text-sm text-slate-600">Licence, certificat ou document fiscal.</p>
            <div className="mt-4">
              <UploadForm pharmacyId={pharmacy?.id ?? user.id} uploadType="document" />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">Documents joints</h2>
          {!documents || documents.length === 0 ? (
            <p className="mt-3 text-slate-600">Aucun document uploadé pour le moment.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {documents.map((document) => (
                <li key={document.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
                  <span className="text-sm font-medium text-slate-700">{document.type}</span>
                  <a href={document.file_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-700 underline">
                    Ouvrir
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

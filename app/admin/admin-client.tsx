'use client';

import { useEffect, useState } from 'react';

type Pharmacy = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
};

async function updatePharmacyStatus(pharmacyId: string, status: 'approved' | 'rejected') {
  const response = await fetch('/api/admin/pharmacies', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pharmacyId, status, note: `${status === 'approved' ? 'Validation du dossier' : 'Dossier refusé'}` }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? 'Erreur lors de la mise à jour');
  }
}

export default function AdminPharmacyClient() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPharmacies() {
      try {
        const response = await fetch('/api/admin/pharmacies');
        if (!response.ok) {
          throw new Error('Accès refusé');
        }

        const payload = await response.json();
        setPharmacies(payload.pharmacies ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de charger les pharmacies');
      } finally {
        setLoading(false);
      }
    }

    void loadPharmacies();
  }, []);

  const handleDecision = async (pharmacyId: string, status: 'approved' | 'rejected') => {
    setProcessingId(pharmacyId);
    try {
      await updatePharmacyStatus(pharmacyId, status);
      setPharmacies((current) =>
        current.map((pharmacy) =>
          pharmacy.id === pharmacyId ? { ...pharmacy, status } : pharmacy,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <p className="text-slate-600">Chargement des demandes…</p>;
  }

  if (error) {
    return <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  }

  const pendingPharmacies = pharmacies.filter((pharmacy) => pharmacy.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Administration</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">Validation des pharmacies</h1>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {pendingPharmacies.length} en attente
        </span>
      </div>

      {pendingPharmacies.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          Aucune pharmacie en attente de validation.
        </div>
      ) : (
        <div className="space-y-4">
          {pendingPharmacies.map((pharmacy) => (
            <article key={pharmacy.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{pharmacy.name}</h2>
                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p>{pharmacy.email ?? 'Email non renseigné'}</p>
                    <p>{pharmacy.phone ?? 'Téléphone non renseigné'}</p>
                    <p>{pharmacy.address ?? 'Adresse non renseignée'}</p>
                    <p>{pharmacy.city ?? 'Ville non renseignée'} · {pharmacy.region ?? 'Région non renseignée'}</p>
                    <p>Soumise le {pharmacy.created_at ? new Date(pharmacy.created_at).toLocaleDateString('fr-FR') : '—'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={processingId === pharmacy.id}
                    onClick={() => void handleDecision(pharmacy.id, 'approved')}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {processingId === pharmacy.id ? 'En cours…' : 'Valider'}
                  </button>
                  <button
                    type="button"
                    disabled={processingId === pharmacy.id}
                    onClick={() => void handleDecision(pharmacy.id, 'rejected')}
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

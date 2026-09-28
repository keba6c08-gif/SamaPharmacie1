'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ClipboardCheck, LocateFixed, MapPin, Package, Power, ShieldCheck, ShoppingBag, TrendingDown } from 'lucide-react';
import { getOnCallPharmacies, setPharmacyOnCall, subscribeToOnCallPharmacies, type OnCallPharmacy } from '@/lib/demo-on-call-pharmacies';

type PharmacienDashboardProps = {
  pharmacyName: string;
  ownerName: string;
  email: string;
  pharmacyId: string;
  pharmacyAddress: string;
  pharmacyCity: string;
  verificationStatus: 'pending' | 'verified';
  preview?: boolean;
};

const initialOrders = [
  { id: 'CMD-2048', patient: 'Aïssatou Fall', medicine: 'Paracétamol 500 mg', status: 'À préparer' },
  { id: 'CMD-2047', patient: 'Moussa Diop', medicine: 'Amoxicilline 1 g', status: 'À vérifier' },
  { id: 'CMD-2046', patient: 'Fatou Ndiaye', medicine: 'Vitamine C 1000 mg', status: 'Prête' },
];

const lowStock = [
  { name: 'Amoxicilline 1 g', quantity: 5 },
  { name: 'Ibuprofène 400 mg', quantity: 4 },
  { name: 'Paracétamol 500 mg', quantity: 8 },
];

export default function PharmacienDashboard({
  pharmacyName,
  ownerName,
  email,
  pharmacyId,
  pharmacyAddress,
  pharmacyCity,
  verificationStatus,
  preview = false,
}: PharmacienDashboardProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [isOnCall, setIsOnCall] = useState(false);
  const [guardMessage, setGuardMessage] = useState('');
  const pendingCount = orders.filter((order) => order.status !== 'Prête').length;

  useEffect(() => {
    const updateGuardState = () => {
      setIsOnCall(getOnCallPharmacies().some((pharmacy) => pharmacy.id === pharmacyId));
    };
    updateGuardState();
    return subscribeToOnCallPharmacies(updateGuardState);
  }, [pharmacyId]);

  function markReady(orderId: string) {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status: 'Prête' } : order));
  }

  function toggleOnCall() {
    setGuardMessage('');
    if (isOnCall) {
      setPharmacyOnCall({
        id: pharmacyId,
        name: pharmacyName,
        address: pharmacyAddress,
        city: pharmacyCity,
        latitude: 0,
        longitude: 0,
        enabled: false,
      });
      setIsOnCall(false);
      setGuardMessage('La garde est terminée dans cette démonstration.');
      return;
    }

    if (!navigator.geolocation) {
      setGuardMessage('La géolocalisation n’est pas disponible dans ce navigateur.');
      return;
    }

    setGuardMessage('Autorisez la localisation pour publier votre pharmacie de garde.');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pharmacy: OnCallPharmacy = {
          id: pharmacyId,
          name: pharmacyName,
          address: pharmacyAddress || 'Adresse à préciser',
          city: pharmacyCity || 'Ville à préciser',
          latitude: coords.latitude,
          longitude: coords.longitude,
          enabled: true,
          demo: preview,
        };
        setPharmacyOnCall(pharmacy);
        setIsOnCall(true);
        setGuardMessage('Votre pharmacie apparaît dans la liste de garde sur cet appareil.');
      },
      (error) => {
        setGuardMessage(error.code === error.PERMISSION_DENIED
          ? 'Autorisez la localisation dans les réglages du navigateur pour activer la garde.'
          : 'Position indisponible. Vérifiez la localisation de votre appareil puis réessayez.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }

  const verified = verificationStatus === 'verified';

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <section className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">{preview ? 'Aperçu démonstration' : 'Espace pharmacie · compte connecté'}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">{pharmacyName}</h1>
          <p className="mt-2 text-sm text-slate-600">Responsable : {ownerName}{email && ` · ${email}`}</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Link href={preview ? '/apercu-pharmacie/stock' : '/pharmacien/stock'} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            <Package className="h-4 w-4" aria-hidden="true" /> Gérer le stock
          </Link>
          <button type="button" onClick={toggleOnCall} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white ${isOnCall ? 'bg-slate-700 hover:bg-slate-800' : 'bg-emerald-700 hover:bg-emerald-800'}`}>
            <Power className="h-4 w-4" aria-hidden="true" />
            {isOnCall ? 'Terminer la garde' : 'Mettre en garde'}
          </button>
        </div>
      </section>
      {guardMessage && <p role="status" className="-mt-5 text-xs leading-5 text-slate-600">{guardMessage}</p>}

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="border-b border-slate-200 pb-4 sm:border-b-0 sm:border-r sm:pr-5">
          <div className="flex items-center gap-2 text-sm text-slate-600"><ShoppingBag className="h-4 w-4 text-emerald-700" aria-hidden="true" /> Commandes à traiter</div>
          <p className="mt-2 text-3xl font-bold text-slate-950">{pendingCount}</p>
        </div>
        <div className="border-b border-slate-200 pb-4 sm:border-b-0 sm:border-r sm:px-5">
          <div className="flex items-center gap-2 text-sm text-slate-600"><TrendingDown className="h-4 w-4 text-amber-700" aria-hidden="true" /> Références à réapprovisionner</div>
          <p className="mt-2 text-3xl font-bold text-slate-950">{lowStock.length}</p>
        </div>
        <div className="sm:pl-5">
          <div className="flex items-center gap-2 text-sm text-slate-600"><ShieldCheck className="h-4 w-4 text-blue-700" aria-hidden="true" /> Ordonnances à vérifier</div>
          <p className="mt-2 text-3xl font-bold text-slate-950">1</p>
        </div>
      </div>

      <section aria-labelledby="on-call-control-heading" className="flex flex-col gap-3 border-y border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isOnCall ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
            {isOnCall ? <MapPin className="h-5 w-5" aria-hidden="true" /> : <LocateFixed className="h-5 w-5" aria-hidden="true" />}
          </div>
          <div>
            <h2 id="on-call-control-heading" className="font-semibold text-slate-950">Service de garde</h2>
            <p className="mt-1 text-sm text-slate-600">
              {isOnCall ? 'Votre pharmacie est signalée de garde sur cet appareil.' : 'Activez la garde pour apparaître dans la recherche des patients.'}
            </p>
          </div>
        </div>
        <span className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-semibold ${isOnCall ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-700'}`}>
          {isOnCall ? 'Garde activée' : 'Garde désactivée'}
        </span>
      </section>

      <section aria-labelledby="verification-heading" className={`flex flex-col gap-3 border-y px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${verified ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
        <div className="flex items-start gap-3">
          <ShieldCheck className={`mt-0.5 h-5 w-5 shrink-0 ${verified ? 'text-emerald-700' : 'text-amber-700'}`} aria-hidden="true" />
          <div>
            <h2 id="verification-heading" className={`font-semibold ${verified ? 'text-emerald-950' : 'text-amber-950'}`}>Dossier professionnel</h2>
            <p className={`mt-1 text-sm leading-5 ${verified ? 'text-emerald-900' : 'text-amber-900'}`}>
              {verified ? 'Les justificatifs de cette pharmacie ont été vérifiés.' : 'Les références déclarées doivent être contrôlées avant que la pharmacie puisse être indiquée comme vérifiée.'}
            </p>
          </div>
        </div>
        <span className={`inline-flex w-fit items-center rounded-full border bg-white px-3 py-1.5 text-xs font-semibold ${verified ? 'border-emerald-300 text-emerald-900' : 'border-amber-300 text-amber-900'}`}>
          {verified ? 'Pharmacie vérifiée' : 'En attente de vérification'}
        </span>
      </section>

      <div className="border-l-4 border-blue-500 bg-blue-50 px-4 py-3 text-sm text-blue-900" role="note">
        {preview
          ? 'Ceci est un aperçu : aucune session n’est ouverte et les modifications ne sont pas enregistrées dans une base.'
          : `Les commandes et quantités affichées sont fictives et ne correspondent pas encore aux données réelles de ${pharmacyName}.`}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <section aria-labelledby="orders-heading">
          <div className="mb-4 flex items-end justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Exemples</p><h2 id="orders-heading" className="mt-1 text-xl font-bold text-slate-950">Commandes récentes</h2></div>
            <span className="text-xs text-slate-500">Données fictives</span>
          </div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {orders.map((order) => (
              <article key={order.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-950">{order.medicine}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${order.status === 'Prête' ? 'bg-emerald-100 text-emerald-800' : order.status === 'À vérifier' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-800'}`}>{order.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{order.patient} · {order.id}</p>
                </div>
                {order.status !== 'Prête' ? (
                  <button type="button" onClick={() => markReady(order.id)} className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:border-emerald-700 hover:text-emerald-800 sm:self-auto">
                    Marquer prête <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : <span className="text-xs font-medium text-emerald-800">Prête à remettre</span>}
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="low-stock-heading" className="border-t border-slate-200 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Exemples</p><h2 id="low-stock-heading" className="mt-1 text-xl font-bold text-slate-950">Stock à surveiller</h2></div><TrendingDown className="h-5 w-5 text-amber-700" aria-hidden="true" /></div>
          <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {lowStock.map((item) => <li key={item.name} className="flex items-center justify-between gap-3 py-3"><span className="text-sm font-medium text-slate-800">{item.name}</span><span className="shrink-0 text-sm text-amber-800">{item.quantity} unités</span></li>)}
          </ul>
          <Link href={preview ? '/apercu-pharmacie/stock' : '/pharmacien/stock'} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950">Voir tout le stock <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </section>
      </div>
    </div>
  );
}
'use client';

import { useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, FileUp, MapPin, Pill, Search } from 'lucide-react';

const orders = [
  { id: 'CMD-2048', medicine: 'Paracétamol 500 mg', pharmacy: 'Pharmacie du Plateau', date: 'Aujourd’hui, 10:42', status: 'Prête à récupérer', tone: 'bg-emerald-100 text-emerald-800' },
  { id: 'CMD-2031', medicine: 'Vitamine C 1000 mg', pharmacy: 'Pharmacie de la Médina', date: 'Hier, 16:18', status: 'Confirmée', tone: 'bg-blue-100 text-blue-800' },
];

export default function PatientPage() {
  const [fileName, setFileName] = useState('');

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFileName(event.target.files?.[0]?.name ?? '');
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <section className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">Espace patient · démonstration</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Bonjour, Aïssatou</h1>
          <p className="mt-2 text-sm text-slate-600">Retrouvez vos commandes et préparez votre prochaine visite.</p>
        </div>
        <Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800">
          <Search className="h-4 w-4" aria-hidden="true" />
          Rechercher un médicament
        </Link>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <section aria-labelledby="orders-heading">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Suivi</p>
              <h2 id="orders-heading" className="mt-1 text-xl font-bold text-slate-950">Mes commandes</h2>
            </div>
            <span className="text-sm text-slate-500">2 commandes</span>
          </div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {orders.map((order) => (
              <article key={order.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-950">{order.medicine}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${order.tone}`}>{order.status}</span>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4" aria-hidden="true" />{order.pharmacy}</p>
                  <p className="mt-1 text-xs text-slate-500">{order.id} · {order.date}</p>
                </div>
                <button type="button" className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:self-auto">
                  Détails <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="prescription-heading" className="border-t border-slate-200 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Documents</p>
          <h2 id="prescription-heading" className="mt-1 text-xl font-bold text-slate-950">Mon ordonnance</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Ajoutez un document pour le retrouver lors de votre prochaine recherche.</p>
          <label htmlFor="prescription-file" className="mt-5 flex min-h-36 cursor-pointer flex-col items-center justify-center border border-dashed border-slate-300 bg-white p-5 text-center transition-colors hover:border-emerald-600 hover:bg-emerald-50/40">
            {fileName ? <CheckCircle2 className="h-7 w-7 text-emerald-700" aria-hidden="true" /> : <FileUp className="h-7 w-7 text-slate-500" aria-hidden="true" />}
            <span className="mt-3 text-sm font-semibold text-slate-800">{fileName || 'Choisir un fichier'}</span>
            <span className="mt-1 text-xs text-slate-500">PDF, JPG ou PNG · démo locale</span>
          </label>
          <input id="prescription-file" type="file" accept=".pdf,image/jpeg,image/png" onChange={handleFileChange} className="sr-only" />
          {fileName && <p className="mt-2 text-xs text-amber-800">Fichier sélectionné dans cette session uniquement; aucun envoi n’est effectué.</p>}
        </section>
      </div>

      <section className="border-t border-slate-200 pt-6" aria-labelledby="next-step-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800"><Clock3 className="h-5 w-5" aria-hidden="true" /></div>
            <div>
              <h2 id="next-step-heading" className="font-semibold text-slate-950">Préparez votre visite</h2>
              <p className="mt-1 text-sm text-slate-600">Les informations affichées sont des exemples et ne sont pas actualisées.</p>
            </div>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950">
            Parcourir le catalogue <Pill className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}

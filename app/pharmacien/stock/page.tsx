'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Minus, PackageCheck, Plus, Search, TrendingDown } from 'lucide-react';

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  prescriptionRequired: boolean;
};

const initialInventory: InventoryItem[] = [
  { id: 1, name: 'Amoxicilline 1 g', category: 'Antibiotique', quantity: 5, price: 4200, prescriptionRequired: true },
  { id: 2, name: 'Ibuprofène 400 mg', category: 'Anti-inflammatoire', quantity: 4, price: 1800, prescriptionRequired: false },
  { id: 3, name: 'Paracétamol 500 mg', category: 'Antalgique', quantity: 24, price: 1200, prescriptionRequired: false },
  { id: 4, name: 'Vitamine C 1000 mg', category: 'Vitamines', quantity: 11, price: 3500, prescriptionRequired: false },
];

export default function PharmacienStockPage({ preview = false }: { preview?: boolean }) {
  const [inventory, setInventory] = useState(initialInventory);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);

  const visibleInventory = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('fr');
    return inventory.filter((item) =>
      `${item.name} ${item.category}`.toLocaleLowerCase('fr').includes(query),
    );
  }, [inventory, search]);
  const lowStockCount = inventory.filter((item) => item.quantity <= 5).length;

  function adjustQuantity(id: number, amount: number) {
    setInventory((currentInventory) => currentInventory.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item,
    ));
    setNotice('Quantité modifiée pour cette démonstration.');
  }

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setInventory((currentInventory) => [
      ...currentInventory,
      {
        id: Date.now(),
        name: trimmedName,
        category: category.trim() || 'Autre',
        quantity: Math.max(0, Number(quantity) || 0),
        price: Math.max(0, Number(price) || 0),
        prescriptionRequired,
      },
    ]);
    setName('');
    setCategory('');
    setQuantity('');
    setPrice('');
    setPrescriptionRequired(false);
    setNotice(`${trimmedName} ajouté au stock de démonstration.`);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <section className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <Link href={preview ? '/apercu-pharmacie' : '/pharmacien'} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-800">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Espace pharmacien
          </Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">Démonstration · Pharmacie du Plateau</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Gestion du stock</h1>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-600">Les ajouts et ajustements sont temporaires et disparaîtront au rechargement de la page.</p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 sm:border-b-0 sm:border-r sm:pr-6">
          <div>
            <p className="text-sm text-slate-600">Références au catalogue</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{inventory.length}</p>
          </div>
          <PackageCheck className="h-6 w-6 text-emerald-700" aria-hidden="true" />
        </div>
        <div className="flex items-center justify-between sm:pl-2">
          <div>
            <p className="text-sm text-slate-600">Stock faible · 5 unités ou moins</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{lowStockCount}</p>
          </div>
          <TrendingDown className="h-6 w-6 text-amber-700" aria-hidden="true" />
        </div>
      </div>

      {notice && <p role="status" className="border-l-4 border-emerald-700 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p>}

      <div className="grid gap-10 lg:grid-cols-[1.45fr_0.75fr]">
        <section aria-labelledby="inventory-heading">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Inventaire</p>
              <h2 id="inventory-heading" className="mt-1 text-xl font-bold text-slate-950">Références enregistrées</h2>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <span className="sr-only">Rechercher dans le stock</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nom ou catégorie" className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" />
            </label>
          </div>

          <div className="overflow-x-auto border-y border-slate-200">
            <table className="w-full min-w-[580px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="py-3 pr-4">Médicament</th>
                  <th className="py-3 pr-4">Prix</th>
                  <th className="py-3 pr-4">Quantité</th>
                  <th className="py-3">Ordonnance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleInventory.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.category}</p>
                    </td>
                    <td className="py-4 pr-4 font-medium text-slate-800">{item.price.toLocaleString('fr-FR')} FCFA</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <button type="button" aria-label={`Retirer une unité de ${item.name}`} onClick={() => adjustQuantity(item.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"><Minus className="h-3.5 w-3.5" aria-hidden="true" /></button>
                        <span className={`min-w-8 text-center font-semibold ${item.quantity <= 5 ? 'text-amber-800' : 'text-slate-900'}`}>{item.quantity}</span>
                        <button type="button" aria-label={`Ajouter une unité de ${item.name}`} onClick={() => adjustQuantity(item.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"><Plus className="h-3.5 w-3.5" aria-hidden="true" /></button>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-xs font-medium ${item.prescriptionRequired ? 'text-amber-800' : 'text-emerald-800'}`}>
                        {item.prescriptionRequired ? 'Requise' : 'Non'}
                      </span>
                    </td>
                  </tr>
                ))}
                {visibleInventory.length === 0 && (
                  <tr><td colSpan={4} className="py-10 text-center text-sm text-slate-500">Aucun médicament ne correspond à cette recherche.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="add-heading" className="border-t border-slate-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Catalogue</p>
          <h2 id="add-heading" className="mt-1 text-xl font-bold text-slate-950">Ajouter une référence</h2>
          <form onSubmit={addItem} className="mt-5 space-y-4">
            <div>
              <label htmlFor="medicine-name" className="mb-1.5 block text-sm font-medium text-slate-800">Nom du médicament</label>
              <input id="medicine-name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Aspirine 100 mg" className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" />
            </div>
            <div>
              <label htmlFor="medicine-category" className="mb-1.5 block text-sm font-medium text-slate-800">Catégorie</label>
              <input id="medicine-category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Ex. Antalgique" className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="medicine-quantity" className="mb-1.5 block text-sm font-medium text-slate-800">Quantité</label>
                <input id="medicine-quantity" type="number" min="0" required value={quantity} onChange={(event) => setQuantity(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" />
              </div>
              <div>
                <label htmlFor="medicine-price" className="mb-1.5 block text-sm font-medium text-slate-800">Prix · FCFA</label>
                <input id="medicine-price" type="number" min="0" required value={price} onChange={(event) => setPrice(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" />
              </div>
            </div>
            <label className="flex items-center gap-2 py-1 text-sm text-slate-700">
              <input type="checkbox" checked={prescriptionRequired} onChange={(event) => setPrescriptionRequired(event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-emerald-700" />
              Ordonnance requise
            </label>
            <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800">
              <Plus className="h-4 w-4" aria-hidden="true" /> Ajouter au stock
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
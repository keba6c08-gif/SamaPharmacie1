'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { AlertCircle, LocateFixed, MapPin, Navigation, Search } from 'lucide-react';
import { getOnCallPharmacies, subscribeToOnCallPharmacies, type OnCallPharmacy } from '@/lib/demo-on-call-pharmacies';

type Pharmacy = {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  price: number;
  quantity: number;
};

type Medicine = {
  id: string;
  name: string;
  category: string;
  prescriptionRequired: boolean;
  pharmacies: Pharmacy[];
};

const demoMedicines: Medicine[] = [
  {
    id: 'para-500',
    name: 'Paracétamol 500 mg',
    category: 'Antalgique',
    prescriptionRequired: false,
    pharmacies: [
      { id: 'plateau', name: 'Pharmacie du Plateau', address: 'Avenue Léopold Sédar Senghor', city: 'Dakar', latitude: 14.6694, longitude: -17.4332, price: 1200, quantity: 24 },
      { id: 'medina', name: 'Pharmacie de la Médina', address: 'Rue 13 x 14', city: 'Dakar', latitude: 14.6761, longitude: -17.4471, price: 1100, quantity: 8 },
      { id: 'thies-centre', name: 'Pharmacie du Centre', address: 'Avenue Caen', city: 'Thiès', latitude: 14.791, longitude: -16.926, price: 1150, quantity: 12 },
    ],
  },
  {
    id: 'vit-c',
    name: 'Vitamine C 1000 mg',
    category: 'Vitamines',
    prescriptionRequired: false,
    pharmacies: [
      { id: 'plateau', name: 'Pharmacie du Plateau', address: 'Avenue Léopold Sédar Senghor', city: 'Dakar', latitude: 14.6694, longitude: -17.4332, price: 3500, quantity: 11 },
      { id: 'saint-louis', name: 'Pharmacie Faidherbe', address: 'Rue Blaise Diagne', city: 'Saint-Louis', latitude: 16.0179, longitude: -16.4896, price: 3200, quantity: 6 },
    ],
  },
  {
    id: 'ibu-400',
    name: 'Ibuprofène 400 mg',
    category: 'Anti-inflammatoire',
    prescriptionRequired: false,
    pharmacies: [
      { id: 'medina', name: 'Pharmacie de la Médina', address: 'Rue 13 x 14', city: 'Dakar', latitude: 14.6761, longitude: -17.4471, price: 1800, quantity: 15 },
      { id: 'thies-centre', name: 'Pharmacie du Centre', address: 'Avenue Caen', city: 'Thiès', latitude: 14.791, longitude: -16.926, price: 1750, quantity: 4 },
    ],
  },
  {
    id: 'amox-1g',
    name: 'Amoxicilline 1 g',
    category: 'Antibiotique',
    prescriptionRequired: true,
    pharmacies: [
      { id: 'plateau', name: 'Pharmacie du Plateau', address: 'Avenue Léopold Sédar Senghor', city: 'Dakar', latitude: 14.6694, longitude: -17.4332, price: 4200, quantity: 5 },
    ],
  },
];

const popularSearches = ['Paracétamol', 'Vitamine C', 'Ibuprofène'];

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr')
    .trim();
}

function distanceInKm(from: GeolocationCoordinates, to: Pick<Pharmacy, 'latitude' | 'longitude'>) {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDifference = radians(to.latitude - from.latitude);
  const longitudeDifference = radians(to.longitude - from.longitude);
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export default function Home() {
  const [medicineQuery, setMedicineQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userPosition, setUserPosition] = useState<GeolocationCoordinates | null>(null);
  const [locationState, setLocationState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [locationError, setLocationError] = useState('');
  const [onCallPharmacies, setOnCallPharmacies] = useState<OnCallPharmacy[]>([]);

  useEffect(() => {
    const refreshOnCallPharmacies = () => setOnCallPharmacies(getOnCallPharmacies());
    refreshOnCallPharmacies();
    return subscribeToOnCallPharmacies(refreshOnCallPharmacies);
  }, []);

  const normalizedMedicine = normalize(medicineQuery);
  const normalizedCity = normalize(cityQuery);
  const results = demoMedicines
    .filter((medicine) => {
      const matchesMedicine =
        !submitted ||
        !normalizedMedicine ||
        normalize(`${medicine.name} ${medicine.category}`).includes(normalizedMedicine);

      return matchesMedicine;
    })
    .map((medicine) => ({
      ...medicine,
      pharmacies: medicine.pharmacies
        .filter((pharmacy) =>
          !normalizedCity || normalize(`${pharmacy.city} ${pharmacy.name}`).includes(normalizedCity),
        )
        .map((pharmacy) => ({
          ...pharmacy,
          distance: userPosition ? distanceInKm(userPosition, pharmacy) : null,
        }))
        .sort((first, second) => {
          if (first.distance === null || second.distance === null) return 0;
          return first.distance - second.distance;
        }),
    }))
    .filter((medicine) => medicine.pharmacies.length > 0);
  const visibleOnCallPharmacies = onCallPharmacies
    .filter((pharmacy) => !normalizedCity || normalize(`${pharmacy.city} ${pharmacy.name}`).includes(normalizedCity))
    .map((pharmacy) => ({
      ...pharmacy,
      distance: userPosition ? distanceInKm(userPosition, pharmacy) : null,
    }))
    .sort((first, second) => {
      if (first.distance === null || second.distance === null) return 0;
      return first.distance - second.distance;
    });

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function searchFor(value: string) {
    setMedicineQuery(value);
    setSubmitted(true);
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n’est pas disponible dans ce navigateur.');
      setLocationState('error');
      return;
    }

    setLocationError('');
    setLocationState('loading');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserPosition(coords);
        setLocationState('idle');
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? 'Autorisez la localisation dans votre navigateur pour voir les distances.'
          : error.code === error.TIMEOUT
            ? 'La localisation prend trop de temps. Réessayez.'
            : 'Position indisponible. Vérifiez les réglages de localisation de votre appareil.';
        setLocationError(message);
        setLocationState('error');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-12 pt-4 sm:pt-8">
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-[linear-gradient(110deg,#e7f0ff_0%,#f4f8ff_50%,#ddf7f4_100%)]">
        <div className="grid lg:min-h-[590px] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative z-10 flex flex-col justify-center px-5 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-blue-800">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              Pharmacie en ligne · Sénégal
            </p>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              Votre santé, <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">en confiance.</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              Trouvez vos médicaments et les pharmacies de garde près de vous.
            </p>

            <form onSubmit={handleSearch} className="mt-7 rounded-xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
              <label htmlFor="medicine-search" className="mb-2 block text-sm font-semibold text-slate-800">
                Rechercher un médicament
              </label>
              <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-300 px-3 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                <Search className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                <input
                  id="medicine-search"
                  value={medicineQuery}
                  onChange={(event) => setMedicineQuery(event.target.value)}
                  placeholder="Nom du médicament"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <label htmlFor="city-search" className="mb-2 mt-4 block text-sm font-semibold text-slate-800">
                Votre ville ou quartier
              </label>
              <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-300 px-3 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                <MapPin className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                <input
                  id="city-search"
                  value={cityQuery}
                  onChange={(event) => setCityQuery(event.target.value)}
                  placeholder="Dakar, Thiès…"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={locateUser}
                  disabled={locationState === 'loading'}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 text-sm font-semibold text-blue-800 transition-colors hover:border-blue-300 hover:bg-blue-100 disabled:cursor-wait disabled:opacity-60"
                >
                  <LocateFixed className="h-4 w-4" aria-hidden="true" />
                  {locationState === 'loading' ? 'Localisation…' : userPosition ? 'Actualiser position' : 'Utiliser ma position'}
                </button>
                <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Rechercher
                </button>
              </div>
              {userPosition && (
                <p role="status" className="mt-2 text-xs text-teal-800">
                  Position activée : pharmacies triées par distance à vol d’oiseau.
                </p>
              )}
              {locationError && <p role="alert" className="mt-2 text-xs leading-5 text-rose-700">{locationError}</p>}
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-600">Populaires :</span>
              {popularSearches.map((search) => (
                <button
                  key={search}
                  type="button"
                  onClick={() => searchFor(search)}
                  className="rounded-full border border-blue-200 bg-white/85 px-3 py-1.5 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  {search}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Démo : prix, stocks et coordonnées sont approximatifs.</p>
          </div>

          <div className="relative min-h-[330px] overflow-hidden bg-[#bcd3fa] sm:min-h-[430px] lg:min-h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-200 to-teal-200" aria-hidden="true" />
            <div className="absolute inset-x-7 bottom-0 top-7 overflow-hidden rounded-t-[45%] bg-gradient-to-b from-blue-400 to-teal-500 sm:inset-x-12 sm:top-10 lg:inset-x-10">
              <Image
                src="/pharmacie-accompagnement.jpg"
                alt="Pharmacien accompagnant un patient en fauteuil dans une pharmacie"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-[55%_center]"
                priority
              />
            </div>
            <div className="absolute bottom-5 left-5 rounded-lg border border-white/70 bg-white/90 px-3 py-2 shadow-sm sm:bottom-7 sm:left-7">
              <p className="text-xs font-semibold text-slate-950">Des soins près de chez vous</p>
              <p className="mt-0.5 text-[11px] text-slate-600">Recherche · disponibilité · garde</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="on-call-heading" className="space-y-5">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-800">Service de garde</p>
            <h2 id="on-call-heading" className="mt-1 text-2xl font-bold text-slate-950">Pharmacies de garde</h2>
          </div>
          <p className="text-xs text-slate-500">Adresses et horaires à confirmer par téléphone.</p>
        </div>

        {visibleOnCallPharmacies.length === 0 ? (
          <p className="border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-600">
            Aucune pharmacie de garde trouvée pour cette ville.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {visibleOnCallPharmacies.map((pharmacy) => (
              <li key={pharmacy.id} className="flex items-center justify-between gap-4 border border-blue-100 bg-white p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-950">{pharmacy.name}</h3>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">De garde</span>
                    {pharmacy.demo && <span className="text-[11px] font-medium text-slate-500">Démo</span>}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{pharmacy.address}, {pharmacy.city}</p>
                  {pharmacy.distance !== null && (
                    <p className="mt-1 text-xs font-semibold text-blue-800">À {pharmacy.distance.toFixed(1)} km · à vol d’oiseau</p>
                  )}
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}${userPosition ? `&origin=${userPosition.latitude},${userPosition.longitude}` : ''}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Itinéraire vers ${pharmacy.name}`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="results-heading" className="space-y-5">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
              {submitted ? 'Résultats de recherche' : 'Aperçu'}
            </p>
            <h2 id="results-heading" className="mt-1 text-2xl font-bold text-slate-950">
              {submitted && medicineQuery ? `Résultats pour « ${medicineQuery} »` : 'Médicaments populaires'}
            </h2>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-slate-400" aria-hidden="true" />
            <h3 className="mt-3 font-semibold text-slate-900">Aucun résultat dans le catalogue de démonstration</h3>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              Essayez un autre nom de médicament ou une autre ville.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {results.map((medicine) => (
              <article key={medicine.id} className="grid gap-4 py-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-8">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-950">{medicine.name}</h3>
                    {medicine.prescriptionRequired && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
                        Ordonnance requise
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{medicine.category}</p>
                  <p className="mt-3 text-sm font-medium text-emerald-800">
                    {medicine.pharmacies.length} {medicine.pharmacies.length > 1 ? 'pharmacies' : 'pharmacie'} trouvée{medicine.pharmacies.length > 1 ? 's' : ''}
                  </p>
                </div>

                <ul className="space-y-2">
                  {medicine.pharmacies.map((pharmacy) => (
                    <li key={pharmacy.id} className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{pharmacy.name}</p>
                        <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          {pharmacy.address}, {pharmacy.city}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{pharmacy.price.toLocaleString('fr-FR')} FCFA</p>
                          <p className="mt-0.5 text-xs text-emerald-800">En stock · {pharmacy.quantity} unités</p>
                          {pharmacy.distance !== null && (
                            <p className="mt-1 text-xs font-semibold text-blue-800">À {pharmacy.distance.toFixed(1)} km · à vol d’oiseau</p>
                          )}
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}${userPosition ? `&origin=${userPosition.latitude},${userPosition.longitude}` : ''}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Itinéraire vers ${pharmacy.name}`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-blue-200 text-blue-700 transition-colors hover:bg-blue-50"
                        >
                          <Navigation className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 border-t border-slate-200 pt-8 sm:grid-cols-3" aria-label="Comment ça marche">
        {[
          { number: '01', title: 'Recherchez', description: 'Saisissez le nom du médicament souhaité.' },
          { number: '02', title: 'Comparez', description: 'Repérez les pharmacies et consultez les prix.' },
        ].map((step) => (
          <div key={step.number} className="flex gap-4">
            <span className="font-mono text-sm font-semibold text-emerald-700">{step.number}</span>
            <div>
              <h3 className="font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">{step.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
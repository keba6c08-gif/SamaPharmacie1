export type OnCallPharmacy = {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  enabled: boolean;
  demo?: boolean;
};

const STORAGE_KEY = 'samapharmacie:on-call-pharmacies';
const CHANGE_EVENT = 'samapharmacie:on-call-pharmacies-changed';

const demoPharmacies: OnCallPharmacy[] = [
  {
    id: 'demo-garde-plateau',
    name: 'Pharmacie du Plateau',
    address: 'Avenue Léopold Sédar Senghor',
    city: 'Dakar',
    latitude: 14.6694,
    longitude: -17.4332,
    enabled: true,
    demo: true,
  },
  {
    id: 'demo-garde-medina',
    name: 'Pharmacie de la Médina',
    address: 'Rue 13 x 14',
    city: 'Dakar',
    latitude: 14.6761,
    longitude: -17.4471,
    enabled: true,
    demo: true,
  },
  {
    id: 'demo-garde-thies',
    name: 'Pharmacie du Centre',
    address: 'Avenue Caen',
    city: 'Thiès',
    latitude: 14.791,
    longitude: -16.926,
    enabled: true,
    demo: true,
  },
];

export function getOnCallPharmacies(): OnCallPharmacy[] {
  const localPharmacies = readLocalPharmacies();
  const overrides = new Map(localPharmacies.map((pharmacy) => [pharmacy.id, pharmacy]));

  return [
    ...demoPharmacies.map((pharmacy) => overrides.get(pharmacy.id) ?? pharmacy),
    ...localPharmacies.filter((pharmacy) => !demoPharmacies.some((demo) => demo.id === pharmacy.id)),
  ].filter((pharmacy) => pharmacy.enabled);
}

export function setPharmacyOnCall(pharmacy: OnCallPharmacy) {
  const pharmacies = readLocalPharmacies().filter((current) => current.id !== pharmacy.id);
  if (pharmacy.enabled) pharmacies.push(pharmacy);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pharmacies));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeToOnCallPharmacies(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readLocalPharmacies(): OnCallPharmacy[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((value): value is OnCallPharmacy =>
      typeof value === 'object' && value !== null &&
      typeof value.id === 'string' && typeof value.name === 'string' &&
      typeof value.address === 'string' && typeof value.city === 'string' &&
      typeof value.latitude === 'number' && typeof value.longitude === 'number' &&
      typeof value.enabled === 'boolean',
    );
  } catch {
    return [];
  }
}
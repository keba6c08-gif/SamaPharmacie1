import { Activity, AlertTriangle, Clock3, Package, Pill, ShieldCheck, ShoppingCart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const stats = [
  { label: 'Commandes aujourd’hui', value: '84', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
  { label: 'Médicaments en stock', value: '1 284', icon: Pill, color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Ordonnances à valider', value: '12', icon: ShieldCheck, color: 'bg-amber-100 text-amber-600' },
  { label: 'Alertes stock', value: '03', icon: AlertTriangle, color: 'bg-rose-100 text-rose-600' },
]

const recentOrders = [
  { id: '#1042', patient: 'Amadou Diop', medicament: 'Doliprane 500mg', status: 'Prête', time: 'Il y a 12 min' },
  { id: '#1041', patient: 'Mariam Sarr', medicament: 'Amoxicilline 1g', status: 'En cours', time: 'Il y a 28 min' },
  { id: '#1040', patient: 'Ibrahima Fall', medicament: 'Paracétamol', status: 'À récupérer', time: 'Il y a 41 min' },
  { id: '#1039', patient: 'Awa Ndao', medicament: 'Vitamine C', status: 'Validée', time: 'Il y a 1 h' },
]

const stockAlerts = [
  { name: 'Paracétamol', qty: 8, status: 'Faible', tone: 'text-amber-700 bg-amber-100' },
  { name: 'Amoxicilline', qty: 4, status: 'Urgent', tone: 'text-red-700 bg-red-100' },
  { name: 'Vitamine C', qty: 19, status: 'Correct', tone: 'text-emerald-700 bg-emerald-100' },
]

const prescriptions = [
  { patient: 'Seynabou Ndiaye', med: 'Ibuprofène', type: 'Ordonnance', status: 'À valider' },
  { patient: 'Omar Ba', med: 'Antibiotique', type: 'Ordonnance', status: 'Validée' },
  { patient: 'Aminata Mbaye', med: 'Vitamine D', type: 'Rappel', status: 'En attente' },
]

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Tableau de bord</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Bienvenue sur votre espace</h1>
        </div>
        <div className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
          Connecté : {user.email}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
              </div>
              <div className={`rounded-xl p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Commandes récentes</h2>
            <button className="text-sm font-medium text-blue-600">Voir tout</button>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{order.id}</span>
                    <span className="text-sm text-gray-500">{order.patient}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{order.medicament}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {order.status}
                  </span>
                  <p className="mt-2 text-xs text-gray-500">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Stock actuel</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {stockAlerts.map((item) => (
              <div key={item.name} className="rounded-xl border border-gray-200 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.tone}`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">Quantité restante : {item.qty} unités</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Ordonnances</h2>
            <Clock3 className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {prescriptions.map((item) => (
              <div key={`${item.patient}-${item.med}`} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{item.patient}</p>
                  <p className="text-sm text-gray-500">{item.med} • {item.type}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Actions rapides</h2>
          <div className="mt-5 space-y-3">
            <button className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100">
              <span>Ajouter un médicament</span>
              <Package className="h-4 w-4" />
            </button>
            <button className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100">
              <span>Valider une ordonnance</span>
              <ShieldCheck className="h-4 w-4" />
            </button>
            <button className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100">
              <span>Consulter les commandes</span>
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

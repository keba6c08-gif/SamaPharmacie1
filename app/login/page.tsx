import { login, signup } from './actions'
import { RoleSelector } from './role-selector'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string; error?: string; message?: string }>
}) {
  const params = searchParams ? await searchParams : {}
  const errorMessage = params.error
  const infoMessage = params.message

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Connexion pharmacie</h2>
          <p className="text-gray-500 mt-2 text-sm">Réservée aux pharmaciens. Les patients accèdent à leur espace sans compte.</p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
            {infoMessage}
          </div>
        )}

        <form className="space-y-6">
          <RoleSelector />

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col space-y-3 pt-4">
            <button
              formAction={login}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Se connecter
            </button>
            <button
              formAction={signup}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              S&apos;inscrire
            </button>
          </div>
        </form>
        <div className="mt-6 border-t border-slate-200 pt-4 text-center">
          <Link href="/apercu-pharmacie" className="text-sm font-medium text-blue-700 underline-offset-4 hover:underline">
            Voir l’aperçu de l’espace pharmacie
          </Link>
        </div>
      </div>
    </div>
  )
}

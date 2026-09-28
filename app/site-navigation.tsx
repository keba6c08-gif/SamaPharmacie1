'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/login/actions';

type SiteNavigationProps = {
  role: string | undefined;
  isAuthenticated: boolean;
};

export default function SiteNavigation({ role, isAuthenticated }: SiteNavigationProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <nav aria-label="Navigation principale" className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-4">
      {!isHomePage && role === 'pharmacien' && (
        <Link href="/pharmacien" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-semibold text-blue-800 hover:bg-blue-50">
          Espace pharmacie
        </Link>
      )}
      {isAuthenticated ? (
        <form action={logout}>
          <button type="submit" className="inline-flex h-9 items-center rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Déconnexion
          </button>
        </form>
      ) : (
        <Link href="/login?role=pharmacien" className="inline-flex h-9 items-center rounded-md bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700">
          Connexion pharmacie
        </Link>
      )}
    </nav>
  );
}
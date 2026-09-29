'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { RoleSelector } from './role-selector'

type LoginFormProps = {
  errorMessage?: string
  infoMessage?: string
}

export function LoginForm({ errorMessage, infoMessage }: LoginFormProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  return (
    <div className="w-full max-w-[420px] rounded-[18px] border border-[#b9e2c9] bg-[#f8fffa] p-5 shadow-[0_12px_35px_rgba(16,120,75,0.12)]">
      <div className="mb-5 grid grid-cols-2 overflow-hidden rounded-xl border border-[#b7dfc5] bg-[#dff3e7] p-1" role="tablist" aria-label="Accès pharmacie">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          onClick={() => setMode('login')}
          className={mode === 'login' ? 'rounded-lg bg-[#ffffff] px-4 py-3 text-base font-semibold text-[#087443] shadow-[0_3px_8px_rgba(16,120,75,0.15)]' : 'rounded-lg px-4 py-3 text-base font-medium text-[#50816a]'}
        >
          Connexion
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signup'}
          onClick={() => setMode('signup')}
          className={mode === 'signup' ? 'rounded-lg bg-[#ffffff] px-4 py-3 text-base font-semibold text-[#087443] shadow-[0_3px_8px_rgba(16,120,75,0.15)]' : 'rounded-lg px-4 py-3 text-base font-medium text-[#50816a]'}
        >
          Inscription
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</div>
      )}

      {infoMessage && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">{infoMessage}</div>
      )}

      <form action={mode === 'login' ? login : signup} className="space-y-4">
        {mode === 'signup' && <RoleSelector />}

        <div>
          <label htmlFor="email" className="mb-2 block text-[15px] font-medium text-[#4b5563]">Adresse email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-[#b9d9c5] bg-[#fbfffc] px-3 py-3 text-base text-[#111827] placeholder:text-[#8ba596] outline-none transition focus:border-[#10a765] focus:bg-white focus:ring-4 focus:ring-[#10a765]/15"
            placeholder="vous@entreprise.com"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="password" className="block text-[15px] font-medium text-[#4b5563]">Mot de passe</label>
            {mode === 'login' && <button type="button" className="text-sm text-[#6b7280] hover:text-[#111827]">Mot de passe oublié ?</button>}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-[#b9d9c5] bg-[#fbfffc] px-3 py-3 text-base text-[#111827] placeholder:text-[#8ba596] outline-none transition focus:border-[#10a765] focus:bg-white focus:ring-4 focus:ring-[#10a765]/15"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-[#087443] px-4 py-3 text-base font-semibold text-white shadow-[0_6px_14px_rgba(8,116,67,0.25)] transition hover:bg-[#055c35] hover:shadow-[0_8px_18px_rgba(8,116,67,0.32)]"
        >
          {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
        </button>
      </form>
    </div>
  )
}

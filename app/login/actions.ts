'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?role=pharmacien&error=Identifiants invalides')
  }

  const accountRole = authData.user.user_metadata.role
  if (accountRole !== 'pharmacien') {
    await supabase.auth.signOut()
    redirect('/login?role=pharmacien&error=Ce compte n’est pas associé à l’espace pharmacie')
  }

  revalidatePath('/', 'layout')
  redirect('/pharmacien')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const role = 'pharmacien'

  const data = {
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  }

  const pharmacistDetails = {
    full_name: String(formData.get('full_name') ?? '').trim(),
    phone: String(formData.get('phone') ?? '').trim(),
    pharmacy_name: String(formData.get('pharmacy_name') ?? '').trim(),
    pharmacy_address: String(formData.get('pharmacy_address') ?? '').trim(),
    pharmacy_city: String(formData.get('pharmacy_city') ?? '').trim(),
    pharmacy_region: String(formData.get('pharmacy_region') ?? '').trim(),
    pharmacist_registration: String(formData.get('pharmacist_registration') ?? '').trim(),
    pharmacy_authorization: String(formData.get('pharmacy_authorization') ?? '').trim(),
  }

  const hasComplianceAttestation = formData.get('compliance_attestation') === 'on'
  if (role === 'pharmacien' && (Object.values(pharmacistDetails).some((value) => !value) || !hasComplianceAttestation)) {
    redirect(`/login?role=pharmacien&error=${encodeURIComponent('Complétez les informations professionnelles et confirmez l’attestation')}`)
  }

  const { data: authData, error } = await supabase.auth.signUp({
    ...data,
    options: {
      data: {
        role,
        ...(role === 'pharmacien'
          ? {
              ...pharmacistDetails,
              compliance_attested: true,
              verification_status: 'pending',
            }
          : {}),
      },
    },
  })

  if (error) {
    redirect(`/login?role=${role}&error=Inscription impossible`)
  }

  revalidatePath('/', 'layout')
  if (!authData.session) {
    redirect(`/login?role=${role}&message=Vérifiez votre courriel pour confirmer votre inscription`)
  }
  redirect('/pharmacien')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

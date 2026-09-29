'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function persistPharmacyRegistration(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  email: string,
  pharmacistDetails: {
    full_name: string
    phone: string
    pharmacy_name: string
    pharmacy_address: string
    pharmacy_city: string
    pharmacy_region: string
    pharmacist_registration: string
    pharmacy_authorization: string
  },
) {
  const profilePayload = {
    id: userId,
    role: 'pharmacien',
    full_name: pharmacistDetails.full_name,
    phone: pharmacistDetails.phone,
    region: pharmacistDetails.pharmacy_region,
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(profilePayload, { onConflict: 'id' })

  if (profileError) {
    throw new Error(`profiles: ${profileError.message}`)
  }

  const { error: pharmacyError } = await supabase
    .from('pharmacies')
    .upsert(
      {
        owner_id: userId,
        name: pharmacistDetails.pharmacy_name,
        address: pharmacistDetails.pharmacy_address,
        city: pharmacistDetails.pharmacy_city,
        region: pharmacistDetails.pharmacy_region,
        phone: pharmacistDetails.phone,
        email,
        pharmacist_registration_number: pharmacistDetails.pharmacist_registration,
        pharmacy_authorization_number: pharmacistDetails.pharmacy_authorization,
        status: 'pending',
      },
      { onConflict: 'owner_id' },
    )

  if (pharmacyError) {
    throw new Error(`pharmacies: ${pharmacyError.message}`)
  }
}

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

  if (authData.user) {
    try {
      await persistPharmacyRegistration(supabase, authData.user.id, data.email, pharmacistDetails)
    } catch (persistError) {
      console.error('Pharmacy registration persistence failed:', persistError)
      redirect('/login?role=pharmacien&error=Inscription enregistrée, mais la fiche pharmacie n’a pas pu être créée')
    }
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

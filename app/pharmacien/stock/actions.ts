'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export async function addMedicine(formData: FormData) {
  const nom = String(formData.get('nom') ?? '').trim()
  const categorie = String(formData.get('categorie') ?? '').trim() || null
  const ordonnance_requise = formData.get('ordonnance_requise') === 'on'

  if (!nom) {
    redirect('/pharmacien/stock?error=Le nom du médicament est requis')
  }

  await prisma.medicaments.create({
    data: {
      nom,
      categorie,
      ordonnance_requise,
    },
  })

  revalidatePath('/pharmacien/stock')
  redirect('/pharmacien/stock')
}

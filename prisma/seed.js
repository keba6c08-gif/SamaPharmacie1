const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Créer quelques médicaments
  const doliprane = await prisma.medicaments.create({
    data: {
      nom: 'Doliprane 1000mg',
      categorie: 'Antalgique',
      ordonnance_requise: false,
    }
  })

  const amoxicilline = await prisma.medicaments.create({
    data: {
      nom: 'Amoxicilline 500mg',
      categorie: 'Antibiotique',
      ordonnance_requise: true,
    }
  })

  const spasfon = await prisma.medicaments.create({
    data: {
      nom: 'Spasfon',
      categorie: 'Antispasmodique',
      ordonnance_requise: false,
    }
  })

  // 2. Créer un profil Pharmacien
  const pharmacienId = '00000000-0000-0000-0000-000000000001'

  const profilPharmacien = await prisma.profile.create({
    data: {
      id: pharmacienId,
      role: 'pharmacien',
      nom: 'Dr. Diallo',
      telephone: '+221770000000',
      region: 'Dakar'
    }
  })

  // 3. Créer des pharmacies
  const pharmacieCentrale = await prisma.pharmacies.create({
    data: {
      proprietaire_id: profilPharmacien.id,
      nom: 'Pharmacie Centrale de Dakar',
      adresse: 'Avenue Pompidou',
      ville: 'Dakar',
      region: 'Dakar',
      latitude: 14.6738,
      longitude: -17.4339,
      telephone: '338000000',
      horaires: '08:00 - 23:00',
      est_de_garde: true
    }
  })

  const pharmacieMedina = await prisma.pharmacies.create({
    data: {
      proprietaire_id: profilPharmacien.id,
      nom: 'Pharmacie de la Médina',
      adresse: 'Avenue Blaise Diagne',
      ville: 'Dakar',
      region: 'Dakar',
      latitude: 14.6850,
      longitude: -17.4430,
      telephone: '338000001',
      horaires: '08:00 - 20:00',
      est_de_garde: false
    }
  })

  // 4. Ajouter du stock
  await prisma.stocks.createMany({
    data: [
      {
        pharmacie_id: pharmacieCentrale.id,
        medicament_id: doliprane.id,
        quantite: 50,
        prix: 1000 // 1000 FCFA
      },
      {
        pharmacie_id: pharmacieCentrale.id,
        medicament_id: amoxicilline.id,
        quantite: 10,
        prix: 2500
      },
      {
        pharmacie_id: pharmacieMedina.id,
        medicament_id: doliprane.id,
        quantite: 0, // Rupture de stock
        prix: 1000
      },
      {
        pharmacie_id: pharmacieMedina.id,
        medicament_id: spasfon.id,
        quantite: 30,
        prix: 1500
      }
    ]
  })

  console.log('Base de données peuplée avec succès ! 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

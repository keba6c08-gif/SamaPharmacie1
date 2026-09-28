import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const medicaments = await prisma.medicaments.findMany();

  return NextResponse.json(medicaments);
}

export async function POST(request: Request) {
  const donnees = await request.json();

  const medicament = await prisma.medicaments.create({
    data: {
      nom: donnees.nom,
      categorie: donnees.categorie ?? null,
      ordonnance_requise: Boolean(donnees.ordonnance_requise),
    },
  });

  return NextResponse.json(medicament, { status: 201 });
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const medicaments = await prisma.medicament.findMany();

  return NextResponse.json(medicaments);
}

export async function POST(request: Request) {
  const donnees = await request.json();

  const medicament = await prisma.medicament.create({
    data: {
      nom: donnees.nom,
      quantite: Number(donnees.quantite),
      prix: Number(donnees.prix),
      expiration: donnees.expiration,
    },
  });

  return NextResponse.json(medicament, { status: 201 });
}
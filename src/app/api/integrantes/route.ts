import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const integrantes = await prisma.integrante.findMany({
    orderBy: { numero: "asc" },
    include: { aportes: true },
  });
  return NextResponse.json(integrantes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nombres, apellidos, cedula } = body;

  const maxNumero = await prisma.integrante.findFirst({
    orderBy: { numero: "desc" },
    select: { numero: true },
  });

  const nuevoNumero = (maxNumero?.numero ?? 0) + 1;

  const integrante = await prisma.integrante.create({
    data: { numero: nuevoNumero, nombres, apellidos, cedula },
  });

  return NextResponse.json(integrante, { status: 201 });
}

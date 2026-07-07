import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const integranteId = searchParams.get("integranteId");

  const where = integranteId ? { integranteId: parseInt(integranteId) } : {};

  const aportes = await prisma.aporte.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { integrante: true },
  });

  return NextResponse.json(aportes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { integranteId, banco, referencia, fecha, mes, aporte } = body;

  const nuevoAporte = await prisma.aporte.create({
    data: {
      integranteId: parseInt(integranteId),
      banco,
      referencia,
      fecha,
      mes,
      aporte: parseFloat(aporte),
    },
    include: { integrante: true },
  });

  return NextResponse.json(nuevoAporte, { status: 201 });
}

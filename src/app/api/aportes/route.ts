import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const aportes = await prisma.aporte.findMany({
    orderBy: { numero: "asc" },
  });
  return NextResponse.json(aportes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nombres, apellidos, cedula, banco, referencia, fecha, mes, aporte } = body;

  const maxNumero = await prisma.aporte.findFirst({
    orderBy: { numero: "desc" },
    select: { numero: true },
  });

  const nuevoNumero = (maxNumero?.numero ?? 0) + 1;

  const nuevoAporte = await prisma.aporte.create({
    data: {
      numero: nuevoNumero,
      nombres,
      apellidos,
      cedula,
      banco,
      referencia,
      fecha,
      mes,
      aporte: parseFloat(aporte),
    },
  });

  return NextResponse.json(nuevoAporte, { status: 201 });
}

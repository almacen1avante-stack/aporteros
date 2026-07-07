import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const intId = parseInt(id);

  await prisma.aporte.deleteMany({ where: { integranteId: intId } });
  await prisma.integrante.delete({ where: { id: intId } });

  return NextResponse.json({ message: "Eliminado" });
}

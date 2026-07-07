import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const integranteId = searchParams.get("integranteId");

  let query = supabase
    .from("Aporte")
    .select("*, integrante:Integrante(*)")
    .order("createdAt", { ascending: false });

  if (integranteId) query = query.eq("integranteId", parseInt(integranteId));

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { integranteId, banco, referencia, fecha, mes, aporte } = body;

  const { data, error } = await supabase
    .from("Aporte")
    .insert({
      integranteId: parseInt(integranteId),
      banco,
      referencia,
      fecha,
      mes,
      aporte: parseFloat(aporte),
    })
    .select("*, integrante:Integrante(*)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

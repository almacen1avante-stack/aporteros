import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("Integrante")
    .select("*, aportes:Aporte(*)")
    .order("numero", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nombres, apellidos, cedula } = body;

  const { data: maxData } = await supabase
    .from("Integrante")
    .select("numero")
    .order("numero", { ascending: false })
    .limit(1);

  const nuevoNumero = (maxData?.[0]?.numero ?? 0) + 1;

  const { data, error } = await supabase
    .from("Integrante")
    .insert({ numero: nuevoNumero, nombres, apellidos, cedula })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

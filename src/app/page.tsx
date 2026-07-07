"use client";

import { useEffect, useState, useCallback } from "react";

type Integrante = {
  id: number;
  numero: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  aportes: Aporte[];
};

type Aporte = {
  id: number;
  integranteId: number;
  banco: string;
  referencia: string;
  fecha: string;
  mes: string;
  aporte: number;
  createdAt: string;
  integrante?: Integrante;
};

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const formIntDefault = { nombres: "", apellidos: "", cedula: "" };
const formAporteDefault = { integranteId: "", banco: "", referencia: "", fecha: "", mes: "", aporte: "" };

export default function Home() {
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [aportes, setAportes] = useState<Aporte[]>([]);
  const [formInt, setFormInt] = useState(formIntDefault);
  const [formAporte, setFormAporte] = useState(formAporteDefault);
  const [selectedInt, setSelectedInt] = useState<string>("");

  const cargarIntegrantes = useCallback(async () => {
    const res = await fetch("/api/integrantes");
    setIntegrantes(await res.json());
  }, []);

  const cargarAportes = useCallback(async (integranteId?: string) => {
    const url = integranteId ? `/api/aportes?integranteId=${integranteId}` : "/api/aportes";
    const res = await fetch(url);
    setAportes(await res.json());
  }, []);

  useEffect(() => { cargarIntegrantes(); }, [cargarIntegrantes]);

  useEffect(() => {
    if (selectedInt) cargarAportes(selectedInt);
    else setAportes([]);
  }, [selectedInt, cargarAportes]);

  const agregarIntegrante = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/integrantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formInt),
    });
    setFormInt(formIntDefault);
    cargarIntegrantes();
  };

  const eliminarIntegrante = async (id: number) => {
    if (!confirm("¿Eliminar este integrante y todos sus aportes?")) return;
    await fetch(`/api/integrantes/${id}`, { method: "DELETE" });
    if (selectedInt === String(id)) { setSelectedInt(""); }
    cargarIntegrantes();
  };

  const agregarAporte = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/aportes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formAporte),
    });
    setFormAporte({ ...formAporteDefault, integranteId: selectedInt });
    cargarAportes(selectedInt);
    cargarIntegrantes();
  };

  const eliminarAporte = async (id: number) => {
    if (!confirm("¿Eliminar este aporte?")) return;
    await fetch(`/api/aportes/${id}`, { method: "DELETE" });
    cargarAportes(selectedInt);
    cargarIntegrantes();
  };

  const totalGeneral = integrantes.reduce((sum, i) => {
    return sum + i.aportes.reduce((s, a) => s + a.aporte, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Control de Aportes</h1>

        {/* SECCIÓN: REGISTRO DE INTEGRANTES */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Registro de Integrantes</h2>
          <form onSubmit={agregarIntegrante} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <input name="nombres" placeholder="Nombres" value={formInt.nombres} onChange={(e) => setFormInt({ ...formInt, nombres: e.target.value })} required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="apellidos" placeholder="Apellidos" value={formInt.apellidos} onChange={(e) => setFormInt({ ...formInt, apellidos: e.target.value })} required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="cedula" placeholder="Cédula" value={formInt.cedula} onChange={(e) => setFormInt({ ...formInt, cedula: e.target.value })} required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
              Agregar Integrante
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <th className="px-3 py-3 text-left">N°</th>
                  <th className="px-3 py-3 text-left">Nombres</th>
                  <th className="px-3 py-3 text-left">Apellidos</th>
                  <th className="px-3 py-3 text-left">Cédula</th>
                  <th className="px-3 py-3 text-right">Total Aportado</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {integrantes.map((i) => {
                  const totalInt = i.aportes.reduce((s, a) => s + a.aporte, 0);
                  return (
                    <tr key={i.id} className={`border-t border-gray-100 hover:bg-gray-50 cursor-pointer ${selectedInt === String(i.id) ? "bg-blue-50" : ""}`}
                      onClick={() => setSelectedInt(String(i.id))}>
                      <td className="px-3 py-2 font-medium text-gray-800">{i.numero}</td>
                      <td className="px-3 py-2 text-gray-700">{i.nombres}</td>
                      <td className="px-3 py-2 text-gray-700">{i.apellidos}</td>
                      <td className="px-3 py-2 text-gray-700">{i.cedula}</td>
                      <td className="px-3 py-2 text-right font-semibold text-green-600">${totalInt.toFixed(2)}</td>
                      <td className="px-3 py-2">
                        <button onClick={(e) => { e.stopPropagation(); eliminarIntegrante(i.id); }}
                          className="text-red-500 hover:text-red-700 text-xs font-medium">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {integrantes.length === 0 && (
                  <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-400">No hay integrantes registrados</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold text-gray-800">
                  <td colSpan={4} className="px-3 py-3 text-right">Total General Acumulado:</td>
                  <td className="px-3 py-3 text-right">${totalGeneral.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* SECCIÓN: GESTIÓN DE APORTES */}
        {integrantes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {selectedInt ? "Registrar Aporte" : "Selecciona un integrante de la lista para gestionar sus aportes"}
            </h2>

            {selectedInt && (
              <>
                {/* Formulario de aporte */}
                <form onSubmit={agregarAporte} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <input name="banco" placeholder="Banco" value={formAporte.banco} onChange={(e) => setFormAporte({ ...formAporte, banco: e.target.value })} required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input name="referencia" placeholder="N° Referencia" value={formAporte.referencia} onChange={(e) => setFormAporte({ ...formAporte, referencia: e.target.value })} required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input name="fecha" type="date" value={formAporte.fecha} onChange={(e) => setFormAporte({ ...formAporte, fecha: e.target.value })} required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <select name="mes" value={formAporte.mes} onChange={(e) => setFormAporte({ ...formAporte, mes: e.target.value })} required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Mes</option>
                    {meses.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <input name="aporte" type="number" step="0.01" placeholder="Aporte ($)" value={formAporte.aporte} onChange={(e) => setFormAporte({ ...formAporte, aporte: e.target.value })} required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="sm:col-span-2 lg:col-span-5">
                    <button type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm">
                      Agregar Aporte
                    </button>
                  </div>
                </form>

                {/* Historial de aportes */}
                <h3 className="text-md font-semibold text-gray-600 mb-3">Historial de Aportes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <th className="px-3 py-3 text-left">Banco</th>
                        <th className="px-3 py-3 text-left">Referencia</th>
                        <th className="px-3 py-3 text-left">Fecha</th>
                        <th className="px-3 py-3 text-left">Mes</th>
                        <th className="px-3 py-3 text-right">Aporte</th>
                        <th className="px-3 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {aportes.map((a) => (
                        <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-700">{a.banco}</td>
                          <td className="px-3 py-2 text-gray-700">{a.referencia}</td>
                          <td className="px-3 py-2 text-gray-700">{a.fecha}</td>
                          <td className="px-3 py-2 text-gray-700">{a.mes}</td>
                          <td className="px-3 py-2 text-right font-medium text-gray-800">${a.aporte.toFixed(2)}</td>
                          <td className="px-3 py-2">
                            <button onClick={() => eliminarAporte(a.id)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium">
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                      {aportes.length === 0 && (
                        <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-400">Sin aportes registrados</td></tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold text-gray-800">
                        <td colSpan={4} className="px-3 py-3 text-right">Total del Integrante:</td>
                        <td className="px-3 py-3 text-right">${aportes.reduce((s, a) => s + a.aporte, 0).toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";

type Aporte = {
  id: number;
  numero: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  banco: string;
  referencia: string;
  fecha: string;
  mes: string;
  aporte: number;
};

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const defaultForm = {
  nombres: "", apellidos: "", cedula: "", banco: "",
  referencia: "", fecha: "", mes: "", aporte: "",
};

export default function Home() {
  const [aportes, setAportes] = useState<Aporte[]>([]);
  const [form, setForm] = useState(defaultForm);

  const cargarAportes = useCallback(async () => {
    const res = await fetch("/api/aportes");
    setAportes(await res.json());
  }, []);

  useEffect(() => { cargarAportes(); }, [cargarAportes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/aportes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(defaultForm);
    cargarAportes();
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar este aporte?")) return;
    await fetch(`/api/aportes/${id}`, { method: "DELETE" });
    cargarAportes();
  };

  const total = aportes.reduce((sum, a) => sum + a.aporte, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Control de Aportes</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Nuevo Aporte</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input name="nombres" placeholder="Nombres" value={form.nombres} onChange={handleChange} required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="cedula" placeholder="Cédula" value={form.cedula} onChange={handleChange} required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="banco" placeholder="Banco" value={form.banco} onChange={handleChange} required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="referencia" placeholder="N° Referencia" value={form.referencia} onChange={handleChange} required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="fecha" type="date" value={form.fecha} onChange={handleChange} required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select name="mes" value={form.mes} onChange={handleChange} required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Mes</option>
              {meses.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <input name="aporte" type="number" step="0.01" placeholder="Aporte ($)" value={form.aporte} onChange={handleChange} required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="sm:col-span-2 lg:col-span-4">
              <button type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                Agregar Aporte
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <th className="px-3 py-3 text-left">N°</th>
                  <th className="px-3 py-3 text-left">Nombres</th>
                  <th className="px-3 py-3 text-left">Apellidos</th>
                  <th className="px-3 py-3 text-left">Cédula</th>
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
                    <td className="px-3 py-2 font-medium text-gray-800">{a.numero}</td>
                    <td className="px-3 py-2 text-gray-700">{a.nombres}</td>
                    <td className="px-3 py-2 text-gray-700">{a.apellidos}</td>
                    <td className="px-3 py-2 text-gray-700">{a.cedula}</td>
                    <td className="px-3 py-2 text-gray-700">{a.banco}</td>
                    <td className="px-3 py-2 text-gray-700">{a.referencia}</td>
                    <td className="px-3 py-2 text-gray-700">{a.fecha}</td>
                    <td className="px-3 py-2 text-gray-700">{a.mes}</td>
                    <td className="px-3 py-2 text-right font-medium text-gray-800">${a.aporte.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <button onClick={() => eliminar(a.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {aportes.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-3 py-8 text-center text-gray-400">
                      No hay aportes registrados
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold text-gray-800">
                  <td colSpan={8} className="px-3 py-3 text-right">Total Acumulado:</td>
                  <td className="px-3 py-3 text-right">${total.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

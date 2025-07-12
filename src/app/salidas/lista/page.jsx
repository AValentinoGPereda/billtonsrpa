// src/app/salidas/lista/page.jsx
'use client'

import { useEffect, useState } from 'react'

export default function ListaSalidasPage() {
  const [salidas, setSalidas] = useState([])

  useEffect(() => {
    fetch('/api/salidas')
      .then(r => r.json())
      .then(setSalidas)
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
        Historial de Salidas
      </h1>
      <div className="bg-white rounded-2xl shadow-lg overflow-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              {['ID', 'Pedido', 'Fecha', 'Destino', 'Responsable ID', 'Cantidad'].map(h => (
                <th key={h} className="p-4 text-left text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salidas.length > 0 ? salidas.map(s => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="p-4">{s.id}</td>
                <td className="p-4">{s.pedidoId}</td>
                <td className="p-4">{new Date(s.fechaSalida).toLocaleString()}</td>
                <td className="p-4">{s.destino}</td>
                <td className="p-4">{s.responsableId ?? '—'}</td>
                <td className="p-4">{s.cantidad}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No hay salidas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

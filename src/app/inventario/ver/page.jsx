'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function VerInventarioPage() {
  const [materiales, setMateriales] = useState([])
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    fetch(`/api/inventario${busqueda ? `?q=${busqueda}` : ''}`)
      .then(r => r.json())
      .then(setMateriales)
  }, [busqueda])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Inventario de Materiales</h1>
        <div className="flex space-x-2">
          <Link
            href="/inventario/registro"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Registrar Material
          </Link>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar…"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="border px-3 py-2 rounded pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded shadow overflow-auto mx-auto max-w-4xl">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              {['Código','Nombre','Stock','Ubicación','Acciones'].map(h => (
                <th key={h} className="p-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materiales.map(m => (
              <tr key={m.codigo} className="border-t">
                <td className="p-2">{m.codigo}</td>
                <td className="p-2">{m.nombre}</td>
                <td
                  className={`p-2 ${
                    m.stock <= 10 ? 'text-red-600 font-semibold' : ''
                  }`}
                >
                  {m.stock}
                </td>
                <td className="p-2">{m.ubicacion}</td>
                <td className="p-2 space-x-2">
                  <Link
                    href={`/inventario/editar?codigo=${encodeURIComponent(m.codigo)}`}
                    className="text-blue-600"
                  >
                    ✏️
                  </Link>
                  <button disabled className="text-red-600">🗑️</button>
                </td>
              </tr>
            ))}
            {materiales.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No hay materiales en el inventario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

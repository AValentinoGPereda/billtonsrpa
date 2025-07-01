// src/app/inventario/ver/page.jsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function VerInventarioPage() {
  const [materiales, setMateriales] = useState([])
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    fetch(`/api/inventario${busqueda ? `?q=${busqueda}` : ''}`)
      .then((r) => r.json())
      .then(setMateriales)
  }, [busqueda])

  return (
    <div className="max-w-5xl mx-auto">
      {/* Título */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-900 flex-1">
          Inventario de Materiales
        </h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/inventario/registro"
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            Registrar Material
          </Link>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border rounded-full px-4 py-2 pl-10 focus:outline-none"
            />
            <span className="absolute left-3 top-2 text-gray-500">🔍</span>
          </div>
        </div>
      </div>

      {/* Tarjeta blanca */}
      <div className="bg-white rounded-2xl shadow-lg overflow-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              {['Código', 'Nombre', 'Stock', 'Ubicación', 'Acciones'].map((h) => (
                <th
                  key={h}
                  className="p-4 text-left text-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materiales.map((m) => (
              <tr key={m.codigo} className="border-b last:border-0">
                <td className="p-4 text-gray-800">{m.codigo}</td>
                <td className="p-4 text-gray-800">{m.nombre}</td>
                <td
                  className={`p-4 ${
                    m.stock <= 10
                      ? 'text-red-600 font-semibold'
                      : 'text-gray-800'
                  }`}
                >
                  {m.stock}
                </td>
                <td className="p-4 text-gray-800">{m.ubicacion}</td>
                <td className="p-4 space-x-3 text-gray-800">
                  <Link
                    href={`/inventario/editar?codigo=${encodeURIComponent(
                      m.codigo
                    )}`}
                    className="hover:text-blue-800"
                  >
                    ✏️
                  </Link>
                  <button
                    disabled
                    className="opacity-50 cursor-not-allowed"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {materiales.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-500"
                >
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

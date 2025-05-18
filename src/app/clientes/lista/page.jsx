'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ListaClientesPage() {
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    fetch('/api/clientes/registro')
      .then(res => res.json())
      .then(setClientes)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Lista de Clientes</h1>
        <Link
          href="/clientes/registro"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Registrar Cliente
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Correo</th>
              <th className="p-2 text-left">Celular</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.id}</td>
                <td className="p-2">{c.nombre}</td>
                <td className="p-2">{c.correo}</td>
                <td className="p-2">{c.celular}</td>
                <td className="p-2 space-x-2">
                  {/* Botones de editar/borrar (pendientes de implementar) */}
                  <button disabled className="text-blue-600">✏️</button>
                  <button disabled className="text-red-600">🗑️</button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

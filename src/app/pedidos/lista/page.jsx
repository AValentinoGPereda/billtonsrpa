// src/app/pedidos/lista/page.jsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ListaPedidosPage() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    fetch('/api/pedidos')
      .then(r => r.json())
      .then(setPedidos)
  }, [])

  return (
    <div className="max-w-5xl mx-auto">
      {/* Título y botón */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900 flex-1 text-center">
          Lista de Pedidos del Cliente
        </h1>
        <Link
          href="/pedidos/registro"
          className="bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          Registrar Pedido
        </Link>
      </div>

      {/* Tarjeta blanca */}
      <div className="bg-white rounded-2xl shadow-lg overflow-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              {['id_Ped.','id_Cli.','Prenda','Modelo','Tallas','Cantidad','Detalle','Estado']
                .map(h => (
                  <th key={h} className="p-4 text-left text-gray-700">
                    {h}
                  </th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.idPed} className="border-t last:border-0">
                <td className="p-4 text-gray-800">{p.idPed}</td>
                <td className="p-4 text-gray-800">{p.idCli}</td>
                <td className="p-4 text-gray-800">{p.prenda}</td>
                <td className="p-4 text-gray-800">{p.modelo}</td>
                <td className="p-4 text-gray-800">{p.tallas}</td>
                <td className="p-4 text-gray-800">{p.cantidad}</td>
                <td className="p-4 text-center">
                  <Link
                    href={`/pedidos/${p.idPed}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    🔍
                  </Link>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      p.estadoPed === 'Producción'
                        ? 'bg-green-600'
                        : 'bg-red-500'
                    }`}
                  >
                    {p.estadoPed}
                  </span>
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No hay pedidos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

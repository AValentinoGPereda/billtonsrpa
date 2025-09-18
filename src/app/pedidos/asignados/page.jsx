//src\app\pedidos\asignados\page.jsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ListaPedidosAsignadosPage() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    fetch('/api/pedidos/asignados')
      .then(r => r.json())
      .then(setPedidos)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-center mb-4 text-blue-900">Lista de Pedidos Asignados</h1>
      <div className="bg-white rounded shadow overflow-auto mx-auto max-w-4xl">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              {['id_Ped.','id_Cli.','Prenda','Modelo','Tallas','Cantidad','Detalle']
                .map(h => (
                  <th key={h} className="p-2 text-left text-blue-900">{h}</th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.idPed} className="border-t">
                <td className="p-2 text-blue-900">{p.idPed}</td>
                <td className="p-2 text-blue-900">{p.idCli}</td>
                <td className="p-2 text-blue-900">{p.prenda}</td>
                <td className="p-2 text-blue-900">{p.modelo}</td>
                <td className="p-2 text-blue-900">{p.tallas}</td>
                <td className="p-2 text-blue-900">{p.cantidad}</td>
                <td className="p-2 text-center text-blue-900">
                  <Link href={`/pedidos/asignados/${p.idPed}`} className="text-blue-600">📖</Link>
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No hay pedidos asignados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

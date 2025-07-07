// src/app/pedidos/lista/page.jsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ListaPedidosPage() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    fetch('/api/pedidos')
      .then(r=>r.json())
      .then(setPedidos)
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-900 flex-1">
          Lista de Pedidos
        </h1>
        <Link href="/pedidos/registro"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >Nuevo Pedido</Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              {['ID','Cliente','Tipo','Entrega','Estado','Acción']
                .map(h=>(
                  <th key={h} className="p-4 text-left text-gray-700">{h}</th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {pedidos.length>0 ? pedidos.map(p=>(
              <tr key={p.id} className="border-b">
                <td className="p-4">{p.id}</td>
                <td className="p-4">{p.clienteId}</td>
                <td className="p-4">{p.tipo}</td>
                <td className="p-4">{new Date(p.fechaEntrega).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${
                    p.estado==='Producción'?'bg-yellow-500':
                    p.estado==='Despachado'?'bg-green-600':'bg-red-500'}`}>
                    {p.estado}
                  </span>
                </td>
                <td className="p-4">
                  <Link href={`/pedidos/${p.id}`}
                    className="text-blue-600 hover:text-blue-800">🔍</Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  Sin pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

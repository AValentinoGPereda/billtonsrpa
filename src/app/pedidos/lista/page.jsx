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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Lista de Pedidos del Cliente</h1>
        <Link href="/pedidos/registro" className="bg-green-600 text-white px-4 py-2 rounded">
          Registrar Pedido
        </Link>
      </div>
      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">id_Ped.</th>
              <th className="p-2">id_Cli.</th>
              <th className="p-2">Prenda</th>
              <th className="p-2">Modelo</th>
              <th className="p-2">Tallas</th>
              <th className="p-2">Cantidad</th>
              <th className="p-2">Detalle</th>
              <th className="p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.idPed} className="border-t">
                <td className="p-2">{p.idPed}</td>
                <td className="p-2">{p.idCli}</td>
                <td className="p-2">{p.prenda}</td>
                <td className="p-2">{p.modelo}</td>
                <td className="p-2">{p.tallas}</td>
                <td className="p-2">{p.cantidad}</td>
                <td className="p-2 text-center">
                  <Link href={`/pedidos/${p.idPed}`} className="text-blue-600">🔍</Link>
                </td>
                <td className={`p-2 text-white rounded ${p.estadoPed==='Producción'? 'bg-green-600':'bg-red-500'}`}>
                  {p.estadoPed}
                </td>
              </tr>
            ))}
            {pedidos.length===0 && (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
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

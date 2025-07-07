//src\app\pedidos\[id]\page.jsx
'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function DetallePedidoPage() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    fetch(`/api/pedidos/${id}`)
      .then(r=>r.json())
      .then(data=>{
        if(data.error) setErr(data.error)
        else setP(data)
      })
  }, [id])

  if(err) return <p className="p-6 text-red-500">{err}</p>
  if(!p) return <p className="p-6">Cargando…</p>

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Pedido #{p.id}</h2>
      <ul className="space-y-2">
        <li><strong>Cliente:</strong> {p.clienteId}</li>
        <li><strong>Tipo:</strong> {p.tipo}</li>
        <li><strong>Entrega:</strong> {new Date(p.fechaEntrega).toLocaleDateString()}</li>
        <li><strong>Estado:</strong> {p.estado}</li>
      </ul>

      <h3 className="mt-4 font-medium">Detalles de Prenda</h3>
      <table className="w-full mt-2">
        <thead className="bg-gray-100">
          <tr>
            {['Modelo','Talla','Cantidad'].map(h=>(
              <th key={h} className="p-2 text-left text-gray-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {p.detalles.map(d=>(
            <tr key={d.id} className="border-t">
              <td className="p-2">{d.modelo}</td>
              <td className="p-2">{d.talla}</td>
              <td className="p-2">{d.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex space-x-2">
        <Link href={`/pedidos/${id}/salida`}
          className="bg-blue-600 text-white px-4 py-2 rounded">Salida</Link>
        <Link href={`/pedidos/${id}/devoluciones`}
          className="bg-red-600 text-white px-4 py-2 rounded">Devoluciones</Link>
        <Link href={`/pedidos/${id}/calidad`}
          className="bg-yellow-500 text-white px-4 py-2 rounded">Calidad</Link>
        <Link href={`/pedidos/${id}/asignar-materiales`}
          className="bg-green-600 text-white px-4 py-2 rounded">Asignar Materiales</Link>
      </div>
    </div>
  )
}

//src\app\pedidos\asignados\[id]\page.jsx
'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function DetallePedidoAsignadoPage() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [clientes, setClientes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [pedidoRes, clientesRes] = await Promise.all([
          fetch(`/api/pedidos/${id}`),
          fetch('/api/clientes')
        ])
        const pedidoData = await pedidoRes.json()
        const clientesData = await clientesRes.json()
        if (pedidoData.error) setError(pedidoData.error)
        else {
          setPedido(pedidoData)
          setClientes(clientesData)
        }
      } catch {
        setError('Error al cargar datos')
      }
    }
    fetchData()
  }, [id])

  if (error) return <p className="p-6 text-red-500">{error}</p>
  if (!pedido) return <p className="p-6">Cargando…</p>

  const cliente = clientes.find(c => c.id === pedido.idCli)

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Detalle del Pedido Asignado</h2>
        <ul className="space-y-2">
          {Object.entries({
            'Número de Pedido': pedido.idPed,
            'Cliente': cliente ? `${cliente.nombre} ${cliente.apellido}` : `ID ${pedido.idCli}`,
            Prenda: pedido.prenda,
            Modelo: pedido.modelo,
            Tallas: pedido.tallas,
            Cantidad: pedido.cantidad,
            'Tipo de entrega': pedido.tipoEntrega,
            'Fecha entrega': pedido.fechaEntrega,
          }).map(([label, value]) => (
            <li key={label} className="flex justify-between">
              <span className="font-medium">{label}</span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <h3 className="font-medium mb-1">Detall. del Cliente</h3>
          <div className="bg-gray-100 p-3 rounded">{pedido.detalleCliente}</div>
        </div>
        <div className="mt-4">
          <h3 className="font-medium mb-1">Detall. de confección</h3>
          <div className="bg-gray-100 p-3 rounded">{pedido.detalleConfeccion}</div>
        </div>
      </div>
    </div>
  )
}

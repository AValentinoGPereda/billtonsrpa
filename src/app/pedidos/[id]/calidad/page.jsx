// src/app/pedidos/[id]/calidad/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function CalidadPedidoPage() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [historial, setHistorial] = useState([])
  const [form, setForm] = useState({ aprobadas:'', rectificadas:'' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetch(`/api/pedidos/${id}`)
      .then(r => r.json())
      .then(setPedido)
    fetch(`/api/pedidos/${id}/calidad`)
      .then(r => r.json())
      .then(setHistorial)
  }, [id])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(''); setSuccess('')
  }

  async function handleSubmit() {
    setError(''); setSuccess('')
    if (!form.aprobadas || !form.rectificadas) {
      setError('Ingrese ambas cantidades')
      return
    }
    const res = await fetch(`/api/pedidos/${id}/calidad`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-total-esperado': pedido?.cantidad ?? ''
      },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) setError(data.error)
    else {
      setSuccess(`Inspección guardada (Estado: ${data.estado})`)
      setHistorial(prev => [data, ...prev])
      setForm({ aprobadas:'', rectificadas:'' })
    }
  }

  if (!pedido) return <p className="text-gray-700 text-center p-6">Cargando pedido…</p>

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center text-blue-900 mb-4">
        Calidad del Pedido {id}
      </h1>

      <p className="text-gray-800 mb-4">
        <strong>Total esperado:</strong> {pedido.cantidad}
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-700">Aprobadas</label>
          <input
            type="number" name="aprobadas" min="0"
            value={form.aprobadas} onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700">Rectificadas</label>
          <input
            type="number" name="rectificadas" min="0"
            value={form.rectificadas} onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none"
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded shadow"
        >
          Guardar Inspección
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Historial de Inspecciones
      </h2>
      <ul className="space-y-2 max-h-80 overflow-auto">
        {historial.length === 0 && (
          <li className="text-gray-500">Sin inspecciones registradas.</li>
        )}
        {historial.map(ins => (
          <li key={ins.id} className="border p-4 rounded-lg bg-gray-50">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600 text-sm">
                {new Date(ins.fecha).toLocaleString()}
              </span>
              <span className={`text-sm font-medium ${
                ins.estado === 'FINALIZADO' ? 'text-green-700' : 'text-orange-600'
              }`}>
                {ins.estado}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-gray-800">
              <div><strong>Aprobadas:</strong> {ins.aprobadas}</div>
              <div><strong>Rechazadas:</strong> {ins.rechazadas}</div>
              <div><strong>Rectificadas:</strong> {ins.rectificadas}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

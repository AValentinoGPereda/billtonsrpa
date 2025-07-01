// src/app/pedidos/[id]/devoluciones/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function DevolucionesPage() {
  const { id } = useParams()
  const [historial, setHistorial] = useState([])
  const [form, setForm] = useState({
    cliente:'', tipoPrenda:'', modelo:'', talla:'', motivo:'', accion:''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetch(`/api/pedidos/${id}/devoluciones`)
      .then(r => r.json())
      .then(setHistorial)
  }, [id])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(''); setSuccess('')
  }

  async function handleSubmit() {
    const faltan = Object.entries(form).filter(([k,v])=>!v)
    if (faltan.length) {
      setError('Complete todos los campos')
      return
    }
    const res = await fetch(`/api/pedidos/${id}/devoluciones`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-total-esperado':  Number(prompt('Total de prendas del pedido'))
      },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) setError(data.error)
    else {
      setSuccess('Devolución registrada')
      setHistorial(prev => [data, ...prev])
      setForm({ cliente:'', tipoPrenda:'', modelo:'', talla:'', motivo:'', accion:'' })
    }
  }

  async function handleRectificar(idDev) {
    const res = await fetch(`/api/pedidos/${id}/devoluciones`, {
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ idDevolucion: idDev })
    })
    const data = await res.json()
    if (res.ok) {
      setHistorial(h => h.map(x=> x.id===data.id?data:x))
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center text-blue-900 mb-4">
        Devoluciones Pedido {id}
      </h1>

      <div className="space-y-3 mb-6">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        {['cliente','tipoPrenda','modelo','talla','motivo','accion'].map(field => (
          <div key={field}>
            <label className="block text-gray-700">
              {field === 'tipoPrenda' ? 'Tipo de Prenda'
               : field === 'accion' ? 'Acción (reparar/retrabajar/descarte)'
               : field.charAt(0).toUpperCase()+field.slice(1)}
            </label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none"
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded shadow"
        >
          Guardar Devolución
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Historial de Devoluciones
      </h2>
      <ul className="space-y-2 max-h-80 overflow-auto">
        {historial.length === 0 && (
          <li className="text-gray-500">Sin devoluciones registradas.</li>
        )}
        {historial.map(d => (
          <li key={d.id} className="border p-4 rounded-lg bg-gray-50">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600 text-sm">
                {new Date(d.fecha).toLocaleString()}
              </span>
              {d.alerta && (
                <span className="text-red-700 font-semibold">¡Alerta!</span>
              )}
              <span className={`text-sm font-medium ${
                d.estado === 'RECTIFICADO'
                  ? 'text-green-700'
                  : 'text-orange-600'
              }`}>
                {d.estado}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-gray-800 mb-2">
              <div><strong>Cliente:</strong> {d.cliente}</div>
              <div><strong>Prenda:</strong> {d.tipoPrenda}</div>
              <div><strong>Modelo:</strong> {d.modelo}</div>
              <div><strong>Talla:</strong> {d.talla}</div>
            </div>
            <div className="mb-2"><strong>Motivo:</strong> {d.motivo}</div>
            <div className="mb-2"><strong>Acción:</strong> {d.accion}</div>
            {d.estado === 'RECTIFICACIÓN PENDIENTE' && (
              <button
                onClick={()=> handleRectificar(d.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Marcar como rectificado
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

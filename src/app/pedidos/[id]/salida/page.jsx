// src/app/pedidos/[id]/salida/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function SalidaPedidoPage() {
  const { id } = useParams()
  const [form, setForm] = useState({ destino:'', responsable:'', cantidad:'' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(''); setSuccess('')
  }

  async function handleSubmit() {
    if (!form.destino || !form.responsable || !form.cantidad) {
      setError('Complete todos los campos')
      return
    }
    const res = await fetch(`/api/pedidos/${id}/salida`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) setError(data.error)
    else {
      setSuccess('Salida registrada')
      setForm({ destino:'', responsable:'', cantidad:'' })
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center text-blue-900 mb-4">
        Registrar Salida Pedido {id}
      </h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Destino</label>
          <input
            name="destino" value={form.destino} onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700">Responsable</label>
          <input
            name="responsable" value={form.responsable} onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700">Cantidad</label>
          <input
            name="cantidad" type="number" min="1"
            value={form.cantidad} onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded shadow"
        >
          Guardar Salida
        </button>
      </div>
    </div>
  )
}

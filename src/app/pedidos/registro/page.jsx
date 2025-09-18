// src/app/pedidos/registro/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistroPedidoPage() {
  const [form, setForm] = useState({
    clienteId: '',
    tipo: '',
    fechaEntrega: '',
    detalles: [{ modelo: '', talla: '', cantidad: '' }],
    detalleCliente: '',
    detalleConfeccion: ''
  })
  const [clientes, setClientes] = useState([]) // lista desde la API
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // 🔹 Cargar clientes al inicio
  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await fetch('/api/clientes')
        const data = await res.json()
        setClientes(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error cargando clientes:', err)
        setClientes([])
      }
    }
    fetchClientes()
  }, [])

  function handleChange(e, idx, field) {
    if (field && idx != null) {
      const nuevos = [...form.detalles]
      nuevos[idx][field] = e.target.value
      setForm({ ...form, detalles: nuevos })
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
    setError('')
    setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.clienteId) {
      setError('Debe seleccionar un cliente')
      return
    }
    if (!form.tipo || !form.fechaEntrega) {
      setError('Tipo de prenda y fecha de entrega son obligatorios')
      return
    }

    const payload = {
      clienteId: Number(form.clienteId), // solo el ID
      tipo: form.tipo,
      fechaEntrega: form.fechaEntrega,
      detalles: (form.detalles || []).map(d => ({
        modelo: d.modelo,
        talla: d.talla,
        cantidad: Number(d.cantidad) || 0
      })),
      detalleCliente: form.detalleCliente,
      detalleConfeccion: form.detalleConfeccion
    }

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al registrar pedido')
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/pedidos/lista'), 800)
      }
    } catch (err) {
      console.error('Error en submit:', err)
      setError('Error de conexión con el servidor')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-blue-900">
          Registrar Pedido
        </h2>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Pedido creado ✔️</p>}

        {/* 🔹 ComboBox de clientes */}
        <select
          name="clienteId"
          value={form.clienteId}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded text-blue-900"
        >
          <option value="">-- Seleccione cliente --</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>

        <input
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          placeholder="Tipo de Prenda"
          className="w-full border px-2 py-1 rounded text-blue-900"
        />

        <input
          name="fechaEntrega"
          type="date"
          value={form.fechaEntrega}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded text-blue-900"
        />

        {(form.detalles || []).map((d, i) => (
          <div key={i} className="grid grid-cols-3 gap-2">
            <input
              placeholder="Modelo"
              value={d.modelo}
              onChange={e => handleChange(e, i, 'modelo')}
              className="border px-2 py-1 rounded text-blue-900"
            />
            <input
              placeholder="Talla"
              value={d.talla}
              onChange={e => handleChange(e, i, 'talla')}
              className="border px-2 py-1 rounded text-blue-900"
            />
            <input
              placeholder="Cantidad"
              type="number"
              value={d.cantidad}
              onChange={e => handleChange(e, i, 'cantidad')}
              className="border px-2 py-1 rounded text-blue-900"
            />
          </div>
        ))}

        <textarea
          name="detalleCliente"
          value={form.detalleCliente}
          onChange={handleChange}
          placeholder="Detalle del Cliente"
          className="w-full border px-2 py-1 rounded text-blue-900"
        />

        <textarea
          name="detalleConfeccion"
          value={form.detalleConfeccion}
          onChange={handleChange}
          placeholder="Detalle de Confección"
          className="w-full border px-2 py-1 rounded text-blue-900"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Registrar Pedido
        </button>
      </form>
    </div>
  )
}

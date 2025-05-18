'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistroClientePage() {
  const [form, setForm] = useState({ nombre: '', correo: '', celular: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('/api/clientes/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
    } else {
      setSuccess(true)
      setForm({ nombre: '', correo: '', celular: '' })
      // Opcional: redirigir a la lista tras 1s
      setTimeout(() => router.push('/clientes/lista'), 1000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm relative">
        <h2 className="text-2xl font-semibold text-green-600 mb-1 text-center">
          Registrar Cliente
        </h2>
        <p className="text-center mb-4">Complete el formulario</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <p className="text-sm text-red-500 bg-red-100 p-2 rounded">{error}</p>
          )}
          {success && (
            <div className="absolute top-2 right-2 bg-green-50 border border-green-300 p-3 rounded shadow">
              <span className="block text-green-600">✔️ Cliente Registrado</span>
            </div>
          )}

          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border-b border-gray-400 focus:outline-none py-1"
          />
          <input
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border-b border-gray-400 focus:outline-none py-1"
          />
          <input
            name="celular"
            value={form.celular}
            onChange={handleChange}
            placeholder="Celular"
            className="w-full border-b border-gray-400 focus:outline-none py-1"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded mt-2"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  )
}

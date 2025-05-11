'use client'

import { useState } from 'react'

export default function RegistroUsuarioPage() {
  const [form, setForm] = useState({
    nombre: '',
    usuario: '',
    email: '',
    contraseña: '',
    confirmar: '',
    rol: 'Confección'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const roles = ['Confección', 'Corte', 'Calidad', 'Almacén', 'Administración']

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const res = await fetch('/api/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
    } else {
      setSuccess(true)
      setForm({
        nombre: '',
        usuario: '',
        email: '',
        contraseña: '',
        confirmar: '',
        rol: 'Confección'
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm relative">
        <h2 className="text-2xl font-semibold text-green-600 mb-1 text-center">
          Registrar Trabajador
        </h2>
        <p className="text-center mb-4">Complete el formulario</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <p className="text-sm text-red-500 bg-red-100 p-2 rounded">{error}</p>
          )}
          {success && (
            <div className="absolute top-2 right-2 bg-green-50 border border-green-300 p-3 rounded shadow">
              <span className="block text-green-600">✔️ Se registró al Trabajador</span>
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
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
            placeholder="Usuario"
            className="w-full border-b border-gray-400 focus:outline-none py-1"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border-b border-gray-400 focus:outline-none py-1"
          />
          <input
            name="contraseña"
            type="password"
            value={form.contraseña}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full border-b border-gray-400 focus:outline-none py-1"
          />
          <input
            name="confirmar"
            type="password"
            value={form.confirmar}
            onChange={handleChange}
            placeholder="Confirmar Contraseña"
            className="w-full border-b border-gray-400 focus:outline-none py-1"
          />

          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-2 py-1"
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

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

// src/app/usuarios/registro/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistroUsuarioPage() {
  const [roles, setRoles] = useState([])
  const [form, setForm] = useState({
    nombre: '',
    usuario: '',
    email: '',
    contraseña: '',
    confirmar: '',
    rol: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Al montar, cargamos roles del servidor
  useEffect(() => {
    fetch('/api/roles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRoles(data)
          // Inicializamos el select con el primer rol
          if (data.length > 0) {
            setForm(f => ({ ...f, rol: data[0].nombre }))
          }
        }
      })
      .catch(() => {
        setError('No se pudieron cargar los roles.')
      })
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setError('')
    setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/users', {
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
          rol: roles.length > 0 ? roles[0].nombre : ''
        })
        setTimeout(() => router.refresh(), 1000)
      }
    } catch (networkErr) {
      setError('Error de red: no se pudo conectar al servidor.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm relative">
        <h2 className="text-2xl font-semibold text-green-600 mb-4 text-center">
          Registrar Trabajador
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}
          {success && (
            <div className="absolute top-2 right-2 bg-green-50 border border-green-300 p-3 rounded shadow">
              <span className="text-green-600">✔️ Registrado</span>
            </div>
          )}

          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border-b py-1 focus:outline-none text-blue-900"
          />
          <input
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
            placeholder="Apellido (Usuario)"
            className="w-full border-b py-1 focus:outline-none text-blue-900"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border-b py-1 focus:outline-none text-blue-900"
          />
          <input
            name="contraseña"
            type="password"
            value={form.contraseña}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full border-b py-1 focus:outline-none text-blue-900"
          />
          <input
            name="confirmar"
            type="password"
            value={form.confirmar}
            onChange={handleChange}
            placeholder="Confirmar Contraseña"
            className="w-full border-b py-1 focus:outline-none text-blue-900"
          />

          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded text-blue-900"
          >
            {roles.map(r => (
              <option key={r.id} value={r.nombre}>
                {r.nombre}
              </option>
            ))}
          </select>

          <button type="submit" className="w-full bg-black text-white py-2 rounded">
            Registrar
          </button>
        </form>
      </div>
    </div>
  )
}

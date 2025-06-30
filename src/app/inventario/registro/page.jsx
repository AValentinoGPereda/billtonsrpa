'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistroMaterialPage() {
  const [form, setForm] = useState({ codigo:'', nombre:'', stock:'', ubicacion:'' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(''); setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // Aquí iría fetch('POST /api/inventario/registro', …)
    // Por ahora simulamos éxito:
    setSuccess(true)
    setTimeout(() => router.push('/inventario/ver'), 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">Registrar Material</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">✔️ Material registrado</p>}

          {['codigo','nombre','stock','ubicacion'].map(field => (
            <input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full border-b py-1 focus:outline-none"
            />
          ))}

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

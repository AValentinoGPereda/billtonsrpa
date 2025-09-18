//src\app\inventario\registro\page.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistroMaterialPage() {
  const [form, setForm] = useState({ nombre:'', tipo:'', cantidad:'', umbral:'', color:'', ubicacion:'' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(''); setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('/api/inventario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Error al registrar material')
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/inventario/ver'), 1000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-900">Registrar Material</h2>
        <form onSubmit={handleSubmit} className="space-y-3 text-blue-900">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">✔️ Material registrado</p>}

          {['nombre','tipo','cantidad','umbral','color','ubicacion'].map(field => (
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

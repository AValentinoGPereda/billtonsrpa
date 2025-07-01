'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function EditarInventarioPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const codigo = searchParams.get('codigo') || ''
  const [form, setForm] = useState({ codigo:'', nombre:'', stock:'', ubicacion:'' })
  const [mensaje, setMensaje] = useState('')

  // Precarga al montar
  useEffect(() => {
    if (!codigo) {
      setMensaje('Código no proporcionado')
      return
    }
    fetch(`/api/inventario?q=${codigo}`)
      .then(r => r.json())
      .then(lista => {
        const mat = lista.find(m => m.codigo === codigo)
        if (!mat) setMensaje('Material no encontrado')
        else setForm(mat)
      })
  }, [codigo])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setMensaje('')
  }

  async function guardar() {
    const res = await fetch('/api/inventario', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) setMensaje(data.error)
    else setMensaje('✔️ Actualización exitosa')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Editar Materiales</h2>
        {mensaje && <p className="text-sm text-red-500 mb-2">{mensaje}</p>}

        <div className="space-y-3">
          <div>
            <label className="block">Código</label>
            <input
              name="codigo"
              value={form.codigo}
              disabled
              className="w-full border bg-gray-100 px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block">Stock</label>
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block">Ubicación</label>
            <input
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <button
            onClick={guardar}
            className="w-full bg-blue-600 text-white py-2 rounded mt-2"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}
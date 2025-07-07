// src/app/pedidos/[id]/salida/page.jsx
'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function SalidaPedidoPage() {
  const { id } = useParams()
  const [form, setForm] = useState({ destino:'', responsableId:'', cantidad:'' })
  const [msg, setMsg] = useState({ err:'', ok:'' })

  function hC(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setMsg({ err:'', ok:'' })
  }

  async function onSave() {
    const res = await fetch(`/api/pedidos/${id}/salida`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        destino: form.destino,
        responsableId: Number(form.responsableId),
        cantidad: Number(form.cantidad)
      })
    })
    const d = await res.json()
    if(!res.ok) setMsg({ err:d.error, ok:'' })
    else setMsg({ err:'', ok:'Salida registrada ✔️' })
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Salida Pedido #{id}</h2>
      {msg.err && <p className="text-red-600">{msg.err}</p>}
      {msg.ok && <p className="text-green-600">{msg.ok}</p>}

      {['destino','responsableId','cantidad'].map(field=>(
        <div key={field} className="mb-3">
          <label className="block mb-1 capitalize">{field}</label>
          <input name={field}
            value={form[field]}
            onChange={hC}
            type={field==='cantidad'?'number':'text'}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      ))}

      <button onClick={onSave}
        className="w-full bg-blue-600 text-white py-2 rounded">Guardar</button>
    </div>
  )
}

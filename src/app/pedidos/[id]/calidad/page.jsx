// src/app/pedidos/[id]/calidad/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function CalidadPedidoPage() {
  const { id } = useParams()
  const [hist, setHist] = useState([])
  const [pedido, setPedido] = useState(null)
  const [form, setForm] = useState({ aprobadas:'', rectificadas:'' })
  const [msg, setMsg] = useState({ err:'', ok:'' })

  useEffect(()=>{
    fetch(`/api/pedidos/${id}`).then(r=>r.json()).then(setPedido)
    fetch(`/api/pedidos/${id}/calidad`).then(r=>r.json()).then(setHist)
  },[id])

  function hC(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setMsg({ err:'', ok:'' })
  }

  async function onCreate() {
    const res = await fetch(`/api/pedidos/${id}/calidad`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-total-esperado': pedido?.detalles?.[0]?.cantidad || ''
      },
      body: JSON.stringify({
        aprobadas: Number(form.aprobadas),
        rectificadas: Number(form.rectificadas)
      })
    })
    const d = await res.json()
    if (!res.ok) setMsg({ err:d.error, ok:'' })
    else {
      setHist([d, ...hist])
      setMsg({ err:'', ok:`Inspección ${d.estado}` })
    }
  }

  if(!pedido) return <p className="p-6">Cargando…</p>

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Calidad Pedido #{id}
      </h2>
      <p className="mb-3"><strong>Total esperado:</strong> {pedido.detalles[0]?.cantidad}</p>
      {msg.err && <p className="text-red-600">{msg.err}</p>}
      {msg.ok && <p className="text-green-600">{msg.ok}</p>}

      <div className="mb-4">
        <label>🌟 Aprobadas</label>
        <input name="aprobadas" value={form.aprobadas}
          onChange={hC} type="number" min="0"
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div className="mb-4">
        <label>⚠️ Rectificadas</label>
        <input name="rectificadas" value={form.rectificadas}
          onChange={hC} type="number" min="0"
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <button onClick={onCreate}
        className="w-full bg-yellow-500 text-white py-2 rounded">
        Guardar Inspección
      </button>

      <h3 className="mt-6 font-medium">Historial</h3>
      <ul className="mt-2 space-y-2 max-h-60 overflow-auto">
        {hist.map(i=>(
          <li key={i.id} className="border p-3 rounded bg-gray-50">
            <div className="flex justify-between">
              <span>{new Date(i.fechaControl).toLocaleString()}</span>
              <span>{i.estado}</span>
            </div>
            <div className="mt-1 flex space-x-4">
              <span>Aprov.: {i.aprobadas}</span>
              <span>Rech.: {i.rechazadas}</span>
              <span>Rect.: {i.rectificadas}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

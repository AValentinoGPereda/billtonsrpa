// src/app/pedidos/[id]/devoluciones/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function DevolucionesPage() {
  const { id } = useParams()
  const [hist, setHist] = useState([])
  const [form, setForm] = useState({
    clienteId:'', modelo:'', defecto:'', cantidad:'', accion:''
  })
  const [msg, setMsg] = useState({ err:'', ok:'' })

  useEffect(()=>{
    fetch(`/api/pedidos/${id}/devoluciones`)
      .then(r=>r.json())
      .then(setHist)
  },[id])

  function hC(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setMsg({ err:'', ok:'' })
  }

  async function onCreate() {
    const res = await fetch(`/api/pedidos/${id}/devoluciones`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        ...form,
        clienteId: Number(form.clienteId),
        cantidad: Number(form.cantidad)
      })
    })
    const d = await res.json()
    if (!res.ok) setMsg({ err:d.error, ok:'' })
    else {
      setHist([d, ...hist])
      setMsg({ err:'', ok:'Devolución creada ✔️' })
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Devoluciones Pedido #{id}</h2>
      {msg.err && <p className="text-red-600">{msg.err}</p>}
      {msg.ok && <p className="text-green-600">{msg.ok}</p>}

      {['clienteId','modelo','defecto','cantidad','accion'].map(f=>(
        <div key={f} className="mb-3">
          <label className="block mb-1 capitalize">{f}</label>
          <input name={f}
            value={form[f]}
            onChange={hC}
            type={f==='cantidad'?'number':'text'}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      ))}

      <button onClick={onCreate}
        className="w-full bg-red-600 text-white py-2 rounded">Registrar</button>

      <h3 className="mt-6 font-medium">Historial</h3>
      <ul className="space-y-2 mt-2 max-h-60 overflow-auto">
        {hist.map(d=>(
          <li key={d.id} className="border p-3 rounded bg-gray-50">
            <div className="flex justify-between">
              <span>{new Date(d.fechaDevolucion).toLocaleString()}</span>
              <span>{d.accion}</span>
            </div>
            <div className="mt-1">
              <strong>Modelo:</strong> {d.modelo} — <strong>Cantidad:</strong> {d.cantidad}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

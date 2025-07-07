//src\app\pedidos\[id]\asignar-materiales\page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function AsignarMaterialesPage() {
  const { id } = useParams()
  const [disp, setDisp] = useState([])
  const [hist, setHist] = useState([])
  const [cant, setCant] = useState({})
  const [msg, setMsg] = useState({ err:'', ok:'' })

  useEffect(()=>{
    fetch(`/api/pedidos/${id}/asignar-materiales`)
      .then(r=>r.json())
      .then(d=>{
        setDisp(d.disponibles)
        setHist(d.historial)
      })
  },[id])

  function hC(e, codigo) {
    setCant({ ...cant, [codigo]: e.target.value })
    setMsg({ err:'', ok:'' })
  }

  async function onSave() {
    const lista = Object.entries(cant)
      .map(([codigo, cantidad])=>({ codigo, cantidad:Number(cantidad) }))
      .filter(a=>a.cantidad>0)
    try {
      const res = await fetch(`/api/pedidos/${id}/asignar-materiales`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ asignaciones: lista })
      })
      const d = await res.json()
      if(!res.ok) throw new Error(d.error)
      setMsg({ err:'', ok:'Asignación OK ✔️' })
      setHist(prev=>[d, ...prev])
      // opcional: actualizar stock local
    } catch(e) {
      setMsg({ err:e.message, ok:'' })
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Asignar Materiales Pedido #{id}</h2>
      {msg.err && <p className="text-red-600">{msg.err}</p>}
      {msg.ok && <p className="text-green-600">{msg.ok}</p>}

      <table className="w-full mb-4">
        <thead className="bg-gray-100">
          <tr>
            {['Código','Nombre','Stock','Cant. a Asignar'].map(h=>(
              <th key={h} className="p-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {disp.map(m=>(
            <tr key={m.id} className="border-t">
              <td className="p-2">{m.id}</td>
              <td className="p-2">{m.nombre}</td>
              <td className="p-2">{m.cantidad}</td>
              <td className="p-2">
                <input type="number" min="0" max={m.cantidad}
                  value={cant[m.id]||''}
                  onChange={e=>hC(e,m.id)}
                  className="w-20 border px-1 py-1 rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={onSave}
        className="w-full bg-blue-600 text-white py-2 rounded">
        Guardar Asignación
      </button>

      <h3 className="mt-6 font-medium">Historial</h3>
      <ul className="mt-2 space-y-2 max-h-60 overflow-auto">
        {hist.map((h,i)=>(
          <li key={i} className="border p-3 rounded bg-gray-50">
            <div className="mb-1"><strong>Fecha:</strong> {new Date(h.createdAt).toLocaleString()}</div>
            <div>
              {h.asignaciones.map(a=>(
                <div key={a.materialId}>
                  Material {a.materialId}: {a.cantidadAsignada}
                </div>
              ))}
            </div>
          </li>
        )) || <li className="text-gray-500">Sin historial.</li>}
      </ul>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function AsignarMaterialesPage() {
  const { id } = useParams()
  const [disponibles, setDisponibles] = useState([])
  const [historial, setHistorial] = useState([])
  const [cantidades, setCantidades] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Carga inicial: GET materiales e historial
  useEffect(() => {
    fetch(`/api/pedidos/${id}/asignar-materiales`)
      .then(r => r.json())
      .then(data => {
        setDisponibles(data.disponibles)
        setHistorial(data.historial)
      })
  }, [id])

  function handleChange(e, codigo) {
    setCantidades({
      ...cantidades,
      [codigo]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  async function guardarAsignacion() {
    const lista = Object.entries(cantidades)
      .map(([codigo, cantidad]) => ({ codigo, cantidad }))
      .filter(item => Number(item.cantidad) > 0)

    try {
      const res = await fetch(`/api/pedidos/${id}/asignar-materiales`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ asignaciones: lista })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess('Asignación exitosa')
      // Actualizar datos
      setDisponibles(disp => disp.map(m => {
        const det = lista.find(a => a.codigo === m.codigo)
        return det ? { ...m, stock: m.stock - Number(det.cantidad) } : m
      }))
      setHistorial(prev => [data.registro, ...prev])
      setCantidades({})
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Asignar Materiales (Pedido {id})</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <table className="w-full mb-4">
        <thead className="bg-gray-100">
          <tr>
            {['Código','Nombre','Stock','Asignar'].map(h => (
              <th key={h} className="p-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {disponibles.map(m => (
            <tr key={m.codigo} className="border-t">
              <td className="p-2">{m.codigo}</td>
              <td className="p-2">{m.nombre}</td>
              <td className="p-2">{m.stock}</td>
              <td className="p-2">
                <input
                  type="number"
                  min="0"
                  max={m.stock}
                  value={cantidades[m.codigo] || ''}
                  onChange={e => handleChange(e, m.codigo)}
                  className="w-20 border px-1 py-1 rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={guardarAsignacion}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar Asignación
      </button>

      <div className="mt-6">
        <h3 className="font-medium mb-2">Historial de Asignaciones</h3>
        <ul className="space-y-2 max-h-40 overflow-auto">
          {historial.map((h, idx) => (
            <li key={idx} className="border p-2 rounded">
              <div><strong>Fecha:</strong> {new Date(h.fecha).toLocaleString()}</div>
              {h.detalles.map((d,i) => (
                <div key={i}>
                  {d.codigo}: {d.cantidad}
                </div>
              ))}
            </li>
          ))}
          {historial.length===0 && <li className="text-gray-500">Sin asignaciones.</li>}
        </ul>
      </div>
    </div>
  )
}

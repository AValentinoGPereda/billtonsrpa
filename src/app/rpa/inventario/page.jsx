// src/app/rpa/inventario/page.jsx
'use client'
import { useEffect, useState } from 'react'

export default function LogsRpaPage() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    fetch('/api/rpa/inventario')
      .then(r => r.json())
      .then(setLogs)
  }, [])

  async function ejecutar() {
    await fetch('/api/rpa/inventario', { method: 'POST' })
    const nuevo = await fetch('/api/rpa/inventario').then(r=>r.json())
    setLogs(nuevo)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-4">
        Logs RPA de Inventario
      </h1>
      <button
        onClick={ejecutar}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        Ejecutar Job Ahora
      </button>
      <div className="bg-white rounded-2xl shadow-lg overflow-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              {['ID','Fecha','Acción','# Detalles'].map(h=>(
                <th key={h} className="p-4 text-left text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map(l=>(
              <tr key={l.id} className="border-b">
                <td className="p-4 text-gray-800">{l.id}</td>
                <td className="p-4 text-gray-800">{new Date(l.fecha).toLocaleString()}</td>
                <td className="p-4 text-gray-800">{l.accion}</td>
                <td className="p-4 text-gray-800">{l.detalles.length}</td>
              </tr>
            ))}
            {logs.length===0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  Sin logs disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

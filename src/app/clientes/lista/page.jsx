// src/app/clientes/lista/page.jsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ListaClientesPage() {
  const [clientes, setClientes] = useState([])
  const [editando, setEditando] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    celular: ''
  })

  useEffect(() => {
    cargarClientes()
  }, [])

  const cargarClientes = () => {
    fetch('/api/clientes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClientes(data)
        } else {
          console.error('API clientes devolvió:', data)
          setClientes([])
        }
      })
  }

  const handleEliminar = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      fetch(`/api/clientes/${id}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert('Error al eliminar: ' + data.error)
        } else {
          alert('Cliente eliminado correctamente')
          cargarClientes() // Recargar la lista
        }
      })
      .catch(error => {
        console.error('Error:', error)
        alert('Error al eliminar cliente')
      })
    }
  }

  const iniciarEdicion = (cliente) => {
    setEditando(cliente.id)
    setFormData({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      correo: cliente.correo,
      celular: cliente.celular
    })
  }

  const cancelarEdicion = () => {
    setEditando(null)
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      celular: ''
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const guardarEdicion = (id) => {
    fetch(`/api/clientes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert('Error al actualizar: ' + data.error)
      } else {
        alert('Cliente actualizado correctamente')
        setEditando(null)
        cargarClientes() // Recargar la lista
      }
    })
    .catch(error => {
      console.error('Error:', error)
      alert('Error al actualizar cliente')
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-blue-900">Lista de Clientes</h1>
        <Link
          href="/clientes/registro"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Registrar Cliente
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left text-blue-900">ID</th>
              <th className="p-2 text-left text-blue-900">Nombre</th>
              <th className="p-2 text-left text-blue-900">Apellido</th>
              <th className="p-2 text-left text-blue-900">Correo</th>
              <th className="p-2 text-left text-blue-900">Celular</th>
              <th className="p-2 text-blue-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-2 text-blue-900">{c.id}</td>
                
                {editando === c.id ? (
                  <>
                    <td className="p-2">
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full p-1 border rounded text-blue-900"
                        placeholder={c.nombre}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        className="w-full p-1 border rounded text-blue-900"
                        placeholder={c.apellido}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        className="w-full p-1 border rounded text-blue-900"
                        placeholder={c.correo}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        name="celular"
                        value={formData.celular}
                        onChange={handleInputChange}
                        className="w-full p-1 border rounded text-blue-900"
                        placeholder={c.celular}
                      />
                    </td>
                    <td className="p-2 space-x-2">
                      <button 
                        onClick={() => guardarEdicion(c.id)}
                        className="text-green-600"
                      >
                        ✅
                      </button>
                      <button 
                        onClick={cancelarEdicion}
                        className="text-gray-600"
                      >
                        ❌
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 text-blue-900">{c.nombre}</td>
                    <td className="p-2 text-blue-900">{c.apellido}</td>
                    <td className="p-2 text-blue-900">{c.correo}</td>
                    <td className="p-2 text-blue-900">{c.celular}</td>
                    <td className="p-2 space-x-2">
                      <button 
                        onClick={() => iniciarEdicion(c)}
                        className="text-blue-600"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleEliminar(c.id)}
                        className="text-red-600"
                      >
                        🗑️
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
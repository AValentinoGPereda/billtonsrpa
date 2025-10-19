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
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: '', tipo: '' })
  const [modalConfirmacion, setModalConfirmacion] = useState({ mostrar: false, clienteId: null, clienteNombre: '' })

  useEffect(() => {
    cargarClientes()
  }, [])

  const mostrarNotificacion = (mensaje, tipo = 'exito') => {
    setNotificacion({ mostrar: true, mensaje, tipo })
    setTimeout(() => setNotificacion({ mostrar: false, mensaje: '', tipo: '' }), 3000)
  }

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

  const solicitarEliminacion = (id, nombre, apellido) => {
    setModalConfirmacion({
      mostrar: true,
      clienteId: id,
      clienteNombre: `${nombre} ${apellido}`
    })
  }

  const confirmarEliminacion = () => {
    if (modalConfirmacion.clienteId) {
      fetch(`/api/clientes/${modalConfirmacion.clienteId}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          mostrarNotificacion('Error al eliminar: ' + data.error, 'error')
        } else {
          mostrarNotificacion('Cliente eliminado correctamente')
          cargarClientes()
        }
      })
      .catch(error => {
        console.error('Error:', error)
        mostrarNotificacion('Error al eliminar cliente', 'error')
      })
      .finally(() => {
        setModalConfirmacion({ mostrar: false, clienteId: null, clienteNombre: '' })
      })
    }
  }

  const cancelarEliminacion = () => {
    setModalConfirmacion({ mostrar: false, clienteId: null, clienteNombre: '' })
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
        mostrarNotificacion('Error al actualizar: ' + data.error, 'error')
      } else {
        mostrarNotificacion('Cliente actualizado correctamente')
        setEditando(null)
        cargarClientes()
      }
    })
    .catch(error => {
      console.error('Error:', error)
      mostrarNotificacion('Error al actualizar cliente', 'error')
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Notificación personalizada */}
      {notificacion.mostrar && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
          notificacion.tipo === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {notificacion.mensaje}
          <button 
            onClick={() => setNotificacion({ mostrar: false, mensaje: '', tipo: '' })}
            className="ml-4 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {modalConfirmacion.mostrar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar al cliente <strong>{modalConfirmacion.clienteNombre}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelarEliminacion}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

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
                        onClick={() => solicitarEliminacion(c.id, c.nombre, c.apellido)}
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
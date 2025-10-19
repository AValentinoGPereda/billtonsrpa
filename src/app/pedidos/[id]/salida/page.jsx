// src/app/pedidos/[id]/salida/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function SalidaPedidoPage() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [trabajadores, setTrabajadores] = useState([])
  const [form, setForm] = useState({ 
    destino: '', 
    responsableId: '', 
    cantidad: '' 
  })
  const [mensaje, setMensaje] = useState({ error: '', exito: '' })
  const [cargando, setCargando] = useState(false)
  const [procesandoEnvio, setProcesandoEnvio] = useState(false)

  // Cargar datos del pedido y trabajadores
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true)
        const [resPedido, resTrabajadores] = await Promise.all([
          fetch(`/api/pedidos/${id}`),
          fetch('/api/trabajadores')
        ])
        
        if (!resPedido.ok) throw new Error('Error cargando datos del pedido')
        if (!resTrabajadores.ok) throw new Error('Error cargando trabajadores')
        
        const pedidoData = await resPedido.json()
        const trabajadoresData = await resTrabajadores.json()
        
        setPedido(pedidoData)
        setTrabajadores(Array.isArray(trabajadoresData) ? trabajadoresData : [])
      } catch (error) {
        console.error('Error cargando datos:', error)
        setMensaje({ error: 'Error cargando datos: ' + error.message, exito: '' })
      } finally {
        setCargando(false)
      }
    }
    
    cargarDatos()
  }, [id])

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setMensaje({ error: '', exito: '' })
  }

  const manejarDestinoLocal = () => {
    setForm({ ...form, destino: 'Recojo en local' })
    setMensaje({ error: '', exito: '' })
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setCargando(true)

    // Validación básica
    if (!form.destino || !form.responsableId || !form.cantidad) {
      setMensaje({ error: 'Todos los campos son obligatorios', exito: '' })
      setCargando(false)
      return
    }

    if (Number(form.cantidad) <= 0) {
      setMensaje({ error: 'La cantidad debe ser mayor a 0', exito: '' })
      setCargando(false)
      return
    }

    try {
      const respuesta = await fetch(`/api/pedidos/${id}/salida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destino: form.destino,
          responsableId: Number(form.responsableId),
          cantidad: Number(form.cantidad)
        })
      })
      
      const datos = await respuesta.json()
      
      if (!respuesta.ok) {
        setMensaje({ error: datos.error, exito: '' })
      } else {
        setForm({ destino: '', responsableId: '', cantidad: '' })
        setMensaje({ error: '', exito: 'Salida registrada exitosamente ✔️' })
        
        // Recargar datos del pedido para actualizar estado
        const resPedido = await fetch(`/api/pedidos/${id}`)
        if (resPedido.ok) {
          const pedidoActualizado = await resPedido.json()
          setPedido(pedidoActualizado)
        }
      }
    } catch (error) {
      setMensaje({ error: 'Error de conexión: ' + error.message, exito: '' })
    } finally {
      setCargando(false)
    }
  }

  const manejarPedidoEnviado = async () => {
    if (!confirm('¿Está seguro de marcar este pedido como Enviado? Esta acción cambiará el grupo del pedido y su estado.')) {
      return
    }

    setProcesandoEnvio(true)
    try {
      const respuesta = await fetch(`/api/pedidos/${id}/cambio-estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: 'Enviado',
          grupoId: 4
        })
      })
      
      const datos = await respuesta.json()
      
      if (!respuesta.ok) {
        throw new Error(datos.error || 'Error al marcar como enviado')
      }
      
      // Actualizar los datos del pedido localmente
      setPedido(prev => prev ? {
        ...prev,
        estado: 'Enviado',
        grupoId: 4,
        grupo: datos.grupo || { id: 4, nombre: 'Enviado' }
      } : null)
      
      setMensaje({ error: '', exito: 'Pedido marcado como Enviado exitosamente ✔️' })
      
    } catch (error) {
      console.error('❌ Error al marcar como enviado:', error)
      setMensaje({ error: error.message, exito: '' })
    } finally {
      setProcesandoEnvio(false)
    }
  }

  // Función para obtener el nombre del grupo
  const obtenerNombreGrupo = () => {
    if (pedido?.grupo?.nombre) {
      return pedido.grupo.nombre;
    }
    
    if (pedido?.grupoId) {
      const grupos = {
        1: 'Administración',
        2: 'Almacén',
        3: 'Calidad',
        4: 'Producción'
      };
      return grupos[pedido.grupoId] || `Grupo ${pedido.grupoId}`;
    }
    
    return 'Sin asignar';
  };

  if (cargando && !pedido) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-blue-900 text-center">Cargando información del pedido...</div>
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-red-600 text-center">Pedido no encontrado</div>
      </div>
    )
  }

  const totalPrendas = pedido.detalles?.reduce((sum, detalle) => sum + detalle.cantidad, 0) || 0

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-blue-900">
        Salida de Pedido #{id}
      </h2>
      
      {/* Resumen del Pedido */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">Resumen del Pedido</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900 mb-4">
          <div>
            <div className="mb-2">
              <span className="font-medium">Cliente:</span> {pedido.cliente.nombre} {pedido.cliente.apellido}
            </div>
            <div className="mb-2">
              <span className="font-medium">Tipo de Prenda:</span> {pedido.tipo}
            </div>
            <div className="mb-2">
              <span className="font-medium">Fecha de Entrega:</span> {new Date(pedido.fechaEntrega).toLocaleDateString()}
            </div>
          </div>
          
          <div>
            <div className="mb-2">
              <span className="font-medium">Total de Prendas:</span> {totalPrendas}
            </div>
            <div className="mb-2">
              <span className="font-medium">Estado:</span> {pedido.estado}
            </div>
            <div className="mb-2">
              <span className="font-medium">Grupo:</span> {obtenerNombreGrupo()}
            </div>
          </div>
        </div>

        {/* Detalles del cliente y confección */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900 mb-4">
          <div>
            <h4 className="font-medium mb-2 text-blue-900">Detalle del Cliente:</h4>
            <div className="bg-white p-3 rounded border min-h-20 text-blue-900">
              {pedido.detalle_cliente ? (
                <p className="whitespace-pre-wrap">{pedido.detalle_cliente}</p>
              ) : (
                <p className="text-gray-500 italic">Sin detalles del cliente</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 text-blue-900">Detalle de Confección:</h4>
            <div className="bg-white p-3 rounded border min-h-20 text-blue-900">
              {pedido.detalle_confeccion ? (
                <p className="whitespace-pre-wrap">{pedido.detalle_confeccion}</p>
              ) : (
                <p className="text-gray-500 italic">Sin detalles de confección</p>
              )}
            </div>
          </div>
        </div>

        {/* Detalles de modelos en el pedido */}
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-blue-900">Detalles del Pedido:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {pedido.detalles?.map((detalle, index) => (
              <div key={index} className="bg-white p-2 rounded border text-blue-900">
                <div><strong>Modelo:</strong> {detalle.modelo}</div>
                <div><strong>Talla:</strong> {detalle.talla}</div>
                <div><strong>Cantidad:</strong> {detalle.cantidad}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mensajes */}
      {mensaje.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
          <p className="text-red-700">{mensaje.error}</p>
        </div>
      )}
      {mensaje.exito && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded">
          <p className="text-green-700">{mensaje.exito}</p>
        </div>
      )}

      {/* Formulario de Salida */}
      <form onSubmit={manejarEnvio} className="space-y-4 mb-6">
        {/* Destino con botón "Local" */}
        <div>
          <label className="block mb-2 font-medium text-blue-900">
            Destino *
          </label>
          <div className="flex gap-2">
            <input 
              type="text"
              name="destino"
              value={form.destino}
              onChange={manejarCambio}
              required
              disabled={cargando}
              placeholder="Ingrese el destino del pedido"
              className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-blue-900"
            />
            <button
              type="button"
              onClick={manejarDestinoLocal}
              disabled={cargando}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded transition-colors whitespace-nowrap"
            >
              Local
            </button>
          </div>
          <p className="text-xs text-blue-500 mt-1">
            Presione &quot;Local&quot; para autocompletar con &quot;Recojo en local&quot;
          </p>
        </div>

        {/* Responsable (Dropdown) */}
        <div>
          <label className="block mb-2 font-medium text-blue-900">
            Responsable *
          </label>
          <select 
            name="responsableId"
            value={form.responsableId}
            onChange={manejarCambio}
            required
            disabled={cargando}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-blue-900"
          >
            <option value="">-- Seleccione responsable --</option>
            {trabajadores
              .filter(trabajador => trabajador.rol_id !== 1) // Excluir rol 1
              .map(trabajador => (
                <option key={trabajador.id} value={trabajador.id} className="text-blue-900">
                  {trabajador.nombre} {trabajador.apellido} 
                  {trabajador.roles?.nombre && ` - ${trabajador.roles.nombre}`}
                </option>
              ))
            }
          </select>
          <p className="text-xs text-blue-500 mt-1">
            Seleccione el responsable del despacho
          </p>
        </div>

        {/* Cantidad */}
        <div>
          <label className="block mb-2 font-medium text-blue-900">
            Cantidad *
          </label>
          <input 
            type="number"
            name="cantidad"
            value={form.cantidad}
            onChange={manejarCambio}
            required
            disabled={cargando}
            min="1"
            max={totalPrendas}
            placeholder="0"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-blue-900"
          />
          <p className="text-xs text-blue-500 mt-1">
            Máximo disponible: {totalPrendas} prendas
          </p>
        </div>

        <button 
          type="submit"
          disabled={cargando}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded transition-colors"
        >
          {cargando ? 'Registrando...' : 'Registrar Salida'}
        </button>
      </form>

      {/* Botón de Pedido Enviado */}
      <button 
        onClick={manejarPedidoEnviado}
        disabled={procesandoEnvio || pedido?.estado === 'Enviado'}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded transition-colors"
      >
        {procesandoEnvio ? 'Procesando...' : 'Pedido Enviado'}
      </button>

    </div>
  )
}
// src/app/pedidos/[id]/devoluciones/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function DevolucionesPage() {
  const { id } = useParams()
  const [historial, setHistorial] = useState([])
  const [pedido, setPedido] = useState(null)
  const [form, setForm] = useState({
    clienteId: '',
    modelo: '',
    defecto: '',
    cantidad: '',
    accion: '',
    fechaDevolucion: ''
  })
  const [mensaje, setMensaje] = useState({ error: '', exito: '' })
  const [cargando, setCargando] = useState(false)
  const [procesandoCorreccion, setProcesandoCorreccion] = useState(false)

  // Cargar datos del pedido y devoluciones
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true)
        const [resPedido, resDevoluciones] = await Promise.all([
          fetch(`/api/pedidos/${id}`),
          fetch(`/api/pedidos/${id}/devoluciones`)
        ])
        
        if (!resPedido.ok) throw new Error('Error cargando datos del pedido')
        if (!resDevoluciones.ok) throw new Error('Error cargando devoluciones')
        
        const pedidoData = await resPedido.json()
        const devolucionesData = await resDevoluciones.json()
        
        setPedido(pedidoData)
        setHistorial(Array.isArray(devolucionesData) ? devolucionesData : [])

        // Establecer clienteId automáticamente desde el pedido
        if (pedidoData && pedidoData.cliente) {
          setForm(prev => ({
            ...prev,
            clienteId: pedidoData.cliente.id.toString(),
            modelo: pedidoData.detalles?.[0]?.modelo || '' // Tomar el primer modelo por defecto
          }))
        }

        // Establecer fecha mínima (fecha de entrega del pedido)
        if (pedidoData && pedidoData.fechaEntrega) {
          const fechaMinima = new Date(pedidoData.fechaEntrega).toISOString().split('T')[0]
          setForm(prev => ({
            ...prev,
            fechaDevolucion: fechaMinima
          }))
        }
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

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setCargando(true)
    
    // Validación básica
    if (!form.modelo || !form.defecto || !form.cantidad || !form.accion || !form.fechaDevolucion) {
      setMensaje({ error: 'Todos los campos son obligatorios', exito: '' })
      setCargando(false)
      return
    }

    if (Number(form.cantidad) <= 0) {
      setMensaje({ error: 'La cantidad debe ser mayor a 0', exito: '' })
      setCargando(false)
      return
    }

    // Validar que la fecha de devolución sea posterior a la fecha de entrega
    if (pedido && pedido.fechaEntrega) {
      const fechaEntrega = new Date(pedido.fechaEntrega)
      const fechaDevolucion = new Date(form.fechaDevolucion)
      
      if (fechaDevolucion < fechaEntrega) {
        setMensaje({ error: 'La fecha de devolución debe ser igual o posterior a la fecha de entrega del pedido', exito: '' })
        setCargando(false)
        return
      }
    }

    try {
      const respuesta = await fetch(`/api/pedidos/${id}/devoluciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          clienteId: Number(form.clienteId),
          cantidad: Number(form.cantidad),
          fechaDevolucion: form.fechaDevolucion
        })
      })
      
      const datos = await respuesta.json()
      
      if (!respuesta.ok) {
        setMensaje({ error: datos.error, exito: '' })
      } else {
        // Agregar nueva devolución al historial
        setHistorial([datos, ...historial])
        
        // Limpiar formulario (excepto clienteId y modelo)
        setForm({
          ...form,
          defecto: '',
          cantidad: '',
          accion: '',
          fechaDevolucion: pedido?.fechaEntrega ? new Date(pedido.fechaEntrega).toISOString().split('T')[0] : ''
        })
        
        setMensaje({ error: '', exito: 'Devolución registrada exitosamente ✔️' })
        
        // Recargar datos del pedido para actualizar estado y grupo
        const resPedido = await fetch(`/api/pedidos/${id}`)
        if (resPedido.ok) {
          const pedidoActualizado = await resPedido.json()
          setPedido(pedidoActualizado)
        }
        
        // Mostrar alerta si corresponde
        if (datos.alerta) {
          alert('🚨 ALERTA: Esta devolución supera el porcentaje aceptable. Se ha notificado al equipo de producción y calidad.')
        }
      }
    } catch (error) {
      setMensaje({ error: 'Error de conexión: ' + error.message, exito: '' })
    } finally {
      setCargando(false)
    }
  }

  const manejarRectificacion = async (devolucionId) => {
    if (!confirm('¿Está seguro de marcar esta devolución como rectificada?')) {
      return
    }

    setCargando(true)
    try {
      const respuesta = await fetch(`/api/pedidos/${id}/devoluciones`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ devolucionId })
      })
      
      const datos = await respuesta.json()
      
      if (!respuesta.ok) {
        setMensaje({ error: datos.error, exito: '' })
      } else {
        // Actualizar el estado en el historial
        setHistorial(historial.map(item => 
          item.id === devolucionId ? datos : item
        ))
        setMensaje({ error: '', exito: 'Devolución marcada como rectificada ✔️' })
      }
    } catch (error) {
      setMensaje({ error: 'Error de conexión: ' + error.message, exito: '' })
    } finally {
      setCargando(false)
    }
  }

  const manejarPedidoCorregido = async () => {
    if (!confirm('¿Está seguro de marcar este pedido como Corregido? Esta acción cambiará el grupo del pedido y su estado.')) {
      return
    }

    setProcesandoCorreccion(true)
    try {
      const respuesta = await fetch(`/api/pedidos/${id}/cambio-estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: 'Completado',
          grupoId: 6
        })
      })
      
      const datos = await respuesta.json()
      
      if (!respuesta.ok) {
        throw new Error(datos.error || 'Error al marcar como corregido')
      }
      
      // Actualizar los datos del pedido localmente
      setPedido(prev => prev ? {
        ...prev,
        estado: 'Completado',
        grupoId: 6,
        grupo: datos.grupo || { id: 6, nombre: 'Completado' }
      } : null)
      
      setMensaje({ error: '', exito: 'Pedido marcado como Corregido exitosamente ✔️' })
      
    } catch (error) {
      console.error('❌ Error al marcar como corregido:', error)
      setMensaje({ error: error.message, exito: '' })
    } finally {
      setProcesandoCorreccion(false)
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
        4: 'Producción',
        5: 'Devolución',
        6: 'Completado'
      };
      return grupos[pedido.grupoId] || `Grupo ${pedido.grupoId}`;
    }
    
    return 'Sin asignar';
  };

  // Calcular totales
  const totalPrendas = pedido?.detalles?.reduce((sum, detalle) => sum + detalle.cantidad, 0) || 0
  const totalDevoluciones = historial.reduce((sum, dev) => sum + dev.cantidad, 0)
  const porcentajeDevolucionTotal = totalPrendas > 0 ? (totalDevoluciones / totalPrendas) * 100 : 0

  // Obtener fecha mínima para el input de fecha (fecha de entrega del pedido)
  const getFechaMinima = () => {
    if (pedido?.fechaEntrega) {
      return new Date(pedido.fechaEntrega).toISOString().split('T')[0]
    }
    return new Date().toISOString().split('T')[0]
  }

  if (cargando && !pedido) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center text-blue-900">Cargando información del pedido...</div>
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-red-600 text-center">Pedido no encontrado</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-blue-900">
        Devoluciones - Pedido #{id}
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
          <h4 className="font-medium mb-2 text-blue-900">Modelos en este Pedido:</h4>
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

      {/* Formulario */}
      <form onSubmit={manejarEnvio} className="space-y-4 mb-6">
        {/* Cliente (solo lectura - viene del pedido) */}
        <div>
          <label className="block mb-2 font-medium text-blue-900">
            Cliente
          </label>
          <input 
            type="text"
            value={pedido.cliente ? `${pedido.cliente.nombre} ${pedido.cliente.apellido}` : ''}
            readOnly
            className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100 cursor-not-allowed text-blue-900"
          />
          <input type="hidden" name="clienteId" value={form.clienteId} />
        </div>

        {/* Modelo (solo lectura - viene del pedido) */}
        <div>
          <label className="block mb-2 font-medium text-blue-900">
            Modelo
          </label>
          <input 
            type="text"
            name="modelo"
            value={form.modelo}
            readOnly
            className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100 cursor-not-allowed text-blue-900"
          />
        </div>

        {/* Fecha de Devolución */}
        <div>
          <label className="block mb-2 font-medium text-blue-900">
            Fecha de Devolución *
          </label>
          <input 
            type="date"
            name="fechaDevolucion"
            value={form.fechaDevolucion}
            onChange={manejarCambio}
            required
            disabled={cargando}
            min={getFechaMinima()}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-blue-900"
          />
          <p className="text-xs text-blue-500 mt-1">
            Fecha igual o posterior a la entrega: {new Date(pedido.fechaEntrega).toLocaleDateString()}
          </p>
        </div>

        {/* Defecto/Motivo */}
        <div>
          <label className="block mb-2 font-medium text-blue-900">
            Motivo de Devolución (Defecto) *
          </label>
          <textarea 
            name="defecto"
            value={form.defecto}
            onChange={manejarCambio}
            required
            disabled={cargando}
            rows="3"
            placeholder="Describa el defecto o motivo de la devolución..."
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-blue-900 placeholder-blue-300"
          />
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
            max={totalPrendas - totalDevoluciones}
            placeholder="0"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-blue-900"
          />
          <p className="text-xs text-blue-500 mt-1">
            Máximo disponible: {totalPrendas - totalDevoluciones} prendas
          </p>
        </div>

        {/* Acción */}
        <div>
          <label className="block mb-2 font-medium text-blue-900">
            Acción de Resolución *
          </label>
          <select 
            name="accion"
            value={form.accion}
            onChange={manejarCambio}
            required
            disabled={cargando}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-blue-900"
          >
            <option value="">-- Seleccione acción --</option>
            <option value="reparación">Reparación</option>
            <option value="retrabajo">Retrabajo</option>
            <option value="descarte">Descarte</option>
          </select>
        </div>

        <button 
          type="submit"
          disabled={cargando}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded transition-colors"
        >
          {cargando ? 'Registrando...' : 'Registrar Devolución'}
        </button>
      </form>

      {/* Botón de Pedido Corregido */}
      <button 
        onClick={manejarPedidoCorregido}
        disabled={procesandoCorreccion || pedido?.estado === 'Completado'}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded transition-colors mb-2"
      >
        {procesandoCorreccion ? 'Procesando...' : 'Pedido Corregido'}
      </button>
      <p className="text-xs text-blue-500 mb-6 text-center">
        Marcar el pedido como corregido cambiará el grupo a &quot;Completado&quot; y el estado a &quot;Completado&quot;
      </p>

      {/* Estadísticas de devoluciones */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">Estadísticas de Devoluciones</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-900">
          <div className="text-center">
            <div className="font-semibold text-blue-600">{totalPrendas}</div>
            <div className="text-xs">Total Prendas</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-red-600">{totalDevoluciones}</div>
            <div className="text-xs">Total Devuelto</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-purple-600">{porcentajeDevolucionTotal.toFixed(1)}%</div>
            <div className="text-xs">Porcentaje</div>
          </div>
          <div className={`text-center ${porcentajeDevolucionTotal > 20 ? 'text-red-600' : 'text-green-600'}`}>
            <div className="font-semibold">{porcentajeDevolucionTotal > 20 ? '🚨 CRÍTICO' : '✅ NORMAL'}</div>
            <div className="text-xs">Estado</div>
          </div>
        </div>
      </div>

      {/* Historial */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-blue-900">
          Historial de Devoluciones
        </h3>
        
        {cargando && historial.length === 0 ? (
          <p className="text-blue-900 text-center py-4">Cargando...</p>
        ) : historial.length === 0 ? (
          <p className="text-blue-900 text-center py-4">
            No hay devoluciones registradas para este pedido
          </p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {historial.map(devolucion => (
              <div 
                key={devolucion.id} 
                className={`border rounded-lg p-4 ${
                  devolucion.alerta ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="text-blue-900">
                    <span className="text-sm">
                      {new Date(devolucion.fechaDevolucion).toLocaleString()}
                    </span>
                    {devolucion.cliente && (
                      <span className="text-sm ml-2">
                        • Cliente: {devolucion.cliente.nombre} {devolucion.cliente.apellido}
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    devolucion.estado === 'RECTIFICACIÓN PENDIENTE' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {devolucion.estado}
                  </span>
                </div>

                {/* Alerta */}
                {devolucion.alerta && (
                  <div className="mb-2 p-2 bg-red-100 border border-red-300 rounded">
                    <span className="text-red-700 font-semibold">
                      🚨 ALERTA: Supera el porcentaje aceptable de devoluciones
                    </span>
                  </div>
                )}

                {/* Detalles */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-900">
                  <div>
                    <span className="font-medium">Modelo:</span> {devolucion.modelo}
                  </div>
                  <div>
                    <span className="font-medium">Cantidad:</span> {devolucion.cantidad}
                  </div>
                  <div>
                    <span className="font-medium">Acción:</span> {devolucion.accion}
                  </div>
                </div>

                {/* Defecto */}
                <div className="mt-2 text-blue-900">
                  <span className="font-medium text-sm">Defecto/Motivo:</span>
                  <p className="text-sm">{devolucion.defecto}</p>
                </div>

                {/* Botón de rectificación */}
                {devolucion.estado === 'RECTIFICACIÓN PENDIENTE' && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => manejarRectificacion(devolucion.id)}
                      disabled={cargando}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm py-1 px-3 rounded transition-colors"
                    >
                      {cargando ? 'Procesando...' : 'Marcar como Rectificado'}
                    </button>
                  </div>
                )}

                {/* Fecha de rectificación */}
                {devolucion.estado === 'RECTIFICADO' && devolucion.fechaRectificacion && (
                  <div className="mt-2 text-xs text-blue-900">
                    Rectificado el: {new Date(devolucion.fechaRectificacion).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
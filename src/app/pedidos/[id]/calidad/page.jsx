// src/app/pedidos/[id]/calidad/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function CalidadPedidoPage() {
  const { id } = useParams()
  const [historial, setHistorial] = useState([])
  const [pedido, setPedido] = useState(null)
  const [form, setForm] = useState({ 
    aprobadas: '', 
    rechazadas: '' 
  })
  const [mensaje, setMensaje] = useState({ error: '', exito: '' })
  const [cargando, setCargando] = useState(false)
  const [procesandoPase, setProcesandoPase] = useState(false)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resPedido, resCalidad] = await Promise.all([
          fetch(`/api/pedidos/${id}`),
          fetch(`/api/pedidos/${id}/calidad`)
        ])
        
        if (!resPedido.ok) throw new Error('Error cargando pedido')
        if (!resCalidad.ok) throw new Error('Error cargando historial de calidad')
        
        const pedidoData = await resPedido.json()
        const calidadData = await resCalidad.json()
        
        console.log('Datos del pedido recibidos:', pedidoData) // Para debug
        setPedido(pedidoData)
        setHistorial(Array.isArray(calidadData) ? calidadData : [])
      } catch (error) {
        console.error('Error cargando datos:', error)
        setMensaje({ error: 'Error cargando datos: ' + error.message, exito: '' })
      }
    }
    
    cargarDatos()
  }, [id])

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Calcular automáticamente las rechazadas si se ingresan las aprobadas
    if (name === 'aprobadas' && pedido) {
      const totalEsperado = pedido.detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0)
      const aprobadas = Number(value) || 0
      const rechazadas = totalEsperado - aprobadas
      
      if (rechazadas >= 0) {
        setForm(prev => ({
          ...prev,
          rechazadas: rechazadas.toString()
        }))
      }
    }
    
    setMensaje({ error: '', exito: '' })
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setCargando(true)

    if (!form.aprobadas || !form.rechazadas) {
      setMensaje({ error: 'Todos los campos son obligatorios', exito: '' })
      setCargando(false)
      return
    }

    const aprobadas = Number(form.aprobadas)
    const rechazadas = Number(form.rechazadas)
    const totalEsperado = pedido.detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0)

    if (aprobadas + rechazadas !== totalEsperado) {
      setMensaje({ error: `La suma de aprobadas y rechazadas debe ser igual al total esperado (${totalEsperado})`, exito: '' })
      setCargando(false)
      return
    }

    try {
      const respuesta = await fetch(`/api/pedidos/${id}/calidad`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aprobadas: aprobadas,
          rechazadas: rechazadas
        })
      })
      
      const datos = await respuesta.json()
      
      if (!respuesta.ok) {
        setMensaje({ error: datos.error, exito: '' })
      } else {
        setHistorial([datos, ...historial])
        setForm({ aprobadas: '', rechazadas: '' })
        setMensaje({ error: '', exito: `Inspección registrada - Estado: ${datos.estado}` })
      }
    } catch (error) {
      setMensaje({ error: 'Error de conexión: ' + error.message, exito: '' })
    } finally {
      setCargando(false)
    }
  }

  const manejarRectificacion = async (inspeccionId) => {
    if (!confirm('¿Está seguro de marcar esta inspección como rectificada? Las prendas rechazadas pasarán a 0.')) {
      return
    }

    setCargando(true)
    try {
      const respuesta = await fetch(`/api/pedidos/${id}/calidad`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inspeccionId })
      })
      
      const datos = await respuesta.json()
      
      if (!respuesta.ok) {
        setMensaje({ error: datos.error, exito: '' })
      } else {
        // Actualizar el estado en el historial
        setHistorial(historial.map(item => 
          item.id === inspeccionId ? datos : item
        ))
        setMensaje({ error: '', exito: 'Inspección marcada como rectificada ✔️' })
      }
    } catch (error) {
      setMensaje({ error: 'Error de conexión: ' + error.message, exito: '' })
    } finally {
      setCargando(false)
    }
  }

  const manejarPaseAAlmacen = async () => {
    if (!confirm('¿Está seguro de pasar este pedido a Almacén? Esta acción cambiará el grupo del pedido.')) {
      return
    }

    setProcesandoPase(true)
    try {
      const respuesta = await fetch(`/api/pedidos/${id}/cambio-estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: 'Almacén',
          grupoId: 2
        })
      })
      
      const datos = await respuesta.json()
      
      if (!respuesta.ok) {
        throw new Error(datos.error || 'Error al pasar a almacén')
      }
      
      // Actualizar los datos del pedido localmente
      setPedido(prev => prev ? {
        ...prev,
        estado: 'Almacén',
        grupoId: 2,
        grupo: datos.grupo || { id: 2, nombre: 'Almacén' }
      } : null)
      
      setMensaje({ error: '', exito: 'Pedido pasado a Almacén exitosamente ✔️' })
      
    } catch (error) {
      console.error('❌ Error en pase a almacén:', error)
      setMensaje({ error: error.message, exito: '' })
    } finally {
      setProcesandoPase(false)
    }
  }

  // Función para obtener el nombre del grupo
  const obtenerNombreGrupo = () => {
    if (pedido?.grupo?.nombre) {
      return pedido.grupo.nombre;
    }
    
    // Si no viene el grupo en la relación, podemos mapear por grupoId
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

  if (!pedido) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-blue-900 text-center">Cargando información del pedido...</div>
      </div>
    )
  }

  const totalEsperado = pedido.detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0)

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-blue-900">
        Control de Calidad - Pedido #{id}
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
              <span className="font-medium">Total de Prendas:</span> {totalEsperado}
            </div>
            <div className="mb-2">
              <span className="font-medium">Estado del Pedido:</span> {pedido.estado}
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

        {/* Detalles por talla */}
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-blue-900">Desglose por Talla:</h4>
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

      {/* Formulario de Inspección */}
      <form onSubmit={manejarEnvio} className="space-y-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aprobadas */}
          <div>
            <label className="block mb-2 font-medium text-blue-900">
              ✅ Prendas Aprobadas *
            </label>
            <input 
              type="number"
              name="aprobadas"
              value={form.aprobadas}
              onChange={manejarCambio}
              required
              disabled={cargando}
              min="0"
              max={totalEsperado}
              placeholder="0"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-blue-900"
            />
          </div>

          {/* Rechazadas (calculadas automáticamente) */}
          <div>
            <label className="block mb-2 font-medium text-blue-900">
              ❌ Prendas Rechazadas *
            </label>
            <input 
              type="number"
              name="rechazadas"
              value={form.rechazadas}
              readOnly
              className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100 cursor-not-allowed text-blue-900"
            />
            <p className="text-xs text-blue-500 mt-1">
              Calculado automáticamente: Total ({totalEsperado}) - Aprobadas
            </p>
          </div>
        </div>

        <button 
          type="submit"
          disabled={cargando}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 text-white font-semibold py-3 px-4 rounded transition-colors"
        >
          {cargando ? 'Registrando...' : 'Guardar Inspección de Calidad'}
        </button>
      </form>

      {/* Botón de Pase a Almacén */}
      <button 
        onClick={manejarPaseAAlmacen}
        disabled={procesandoPase || pedido?.estado === 'Almacén'}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded transition-colors mb-8"
      >
        {procesandoPase ? 'Procesando...' : 'Pase a Almacén'}
      </button>

      {/* Historial de Inspecciones */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-blue-900">
          Historial de Inspecciones
        </h3>
        
        {historial.length === 0 ? (
          <p className="text-blue-900 text-center py-4">
            No hay inspecciones registradas para este pedido
          </p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {historial.map(inspeccion => (
              <div 
                key={inspeccion.id} 
                className="border rounded-lg p-4 bg-gray-50"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="text-blue-900">
                    <span className="text-sm">
                      {new Date(inspeccion.fechaControl).toLocaleString()}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    inspeccion.estado === 'EVALUACIÓN' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {inspeccion.estado}
                  </span>
                </div>

                {/* Detalles de la inspección */}
                <div className="grid grid-cols-3 gap-4 text-sm text-blue-900">
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{inspeccion.aprobadas}</div>
                    <div className="text-xs">Aprobadas</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">{inspeccion.rechazadas}</div>
                    <div className="text-xs">Rechazadas</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{inspeccion.rectificadas}</div>
                    <div className="text-xs">Rectificadas</div>
                  </div>
                </div>

                {/* Botón de rectificación */}
                {inspeccion.estado === 'EVALUACIÓN' && inspeccion.rechazadas > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => manejarRectificacion(inspeccion.id)}
                      disabled={cargando}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm py-1 px-3 rounded transition-colors"
                    >
                      {cargando ? 'Procesando...' : 'Marcar como Rectificado'}
                    </button>
                    <p className="text-xs text-blue-500 mt-1">
                      Al marcar como rectificado, las prendas rechazadas pasarán a 0 y se añadirán a rectificadas
                    </p>
                  </div>
                )}

                {/* Información de rectificación */}
                {inspeccion.estado === 'FINALIZADO' && (
                  <div className="mt-2 text-xs text-blue-900">
                    ✅ Todas las prendas rechazadas han sido rectificadas
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
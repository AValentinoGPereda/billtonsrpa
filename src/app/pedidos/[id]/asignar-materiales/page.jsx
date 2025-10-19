// src/app/pedidos/[id]/asignar-materiales/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function AsignarMaterialesPage() {
  const { id } = useParams()
  const [disp, setDisp] = useState([])
  const [hist, setHist] = useState([])
  const [pedido, setPedido] = useState(null)
  const [cant, setCant] = useState({})
  const [msg, setMsg] = useState({ err: '', ok: '' })
  const [cargando, setCargando] = useState(true)
  const [procesandoPase, setProcesandoPase] = useState(false)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true)
        console.log('🔄 Cargando datos para pedido:', id)
        
        // Cargar datos del pedido y materiales en paralelo
        const [resPedido, resMateriales] = await Promise.all([
          fetch(`/api/pedidos/${id}`),
          fetch(`/api/pedidos/${id}/asignar-materiales`)
        ])
        
        if (!resPedido.ok) {
          throw new Error('Error cargando datos del pedido')
        }
        
        if (!resMateriales.ok) {
          const errorData = await resMateriales.json()
          throw new Error(errorData.error || 'Error cargando materiales')
        }
        
        const pedidoData = await resPedido.json()
        const materialesData = await resMateriales.json()
        
        console.log('📥 Datos recibidos del servidor:', materialesData)
        
        setPedido(pedidoData)
        setDisp(Array.isArray(materialesData.disponibles) ? materialesData.disponibles : [])
        setHist(Array.isArray(materialesData.historial) ? materialesData.historial : [])
        
      } catch (error) {
        console.error('❌ Error cargando datos:', error)
        setMsg({ err: error.message, ok: '' })
      } finally {
        setCargando(false)
      }
    }
    cargarDatos()
  }, [id])

  function manejarCambioCantidad(e, materialId) {
    const nuevaCantidad = e.target.value
    setCant(prev => ({ 
      ...prev, 
      [materialId]: nuevaCantidad 
    }))
    setMsg({ err: '', ok: '' })
  }

  async function guardarAsignacion() {
    // Filtrar solo las asignaciones con cantidad > 0
    const listaAsignaciones = Object.entries(cant)
      .map(([materialId, cantidad]) => ({ 
        codigo: materialId,
        cantidad: Number(cantidad) 
      }))
      .filter(a => a.cantidad > 0)

    if (listaAsignaciones.length === 0) {
      setMsg({ err: 'No hay cantidades válidas para asignar', ok: '' })
      return
    }

    try {
      console.log('💾 Guardando asignaciones:', listaAsignaciones)
      
      const res = await fetch(`/api/pedidos/${id}/asignar-materiales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asignaciones: listaAsignaciones })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error en asignación')
      
      setMsg({ err: '', ok: 'Asignación guardada correctamente ✔️' })
      setCant({})
      
      // Recargar datos actualizados
      console.log('🔄 Recargando datos después de guardar...')
      const refreshRes = await fetch(`/api/pedidos/${id}/asignar-materiales`)
      const refreshData = await refreshRes.json()
      setDisp(Array.isArray(refreshData.disponibles) ? refreshData.disponibles : [])
      setHist(Array.isArray(refreshData.historial) ? refreshData.historial : [])
      
    } catch (error) {
      console.error('❌ Error guardando asignación:', error)
      setMsg({ err: error.message, ok: '' })
    }
  }

  async function manejarPaseACalidad() {
    if (!confirm('¿Está seguro de pasar este pedido a Calidad? Esta acción cambiará el estado del pedido y no se puede deshacer.')) {
      return
    }

    setProcesandoPase(true)
    try {
      const respuesta = await fetch(`/api/pedidos/${id}/cambio-estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: 'Calidad',
          grupoId: 3
        })
      })
      
      const datos = await respuesta.json()
      
      if (!respuesta.ok) {
        throw new Error(datos.error || 'Error al pasar a calidad')
      }
      
      // Actualizar los datos del pedido localmente con datos simples
      setPedido(prev => prev ? {
        ...prev,
        estado: 'Calidad',
        grupoId: 3,
        grupo: datos.grupo || { id: 3, nombre: 'Calidad' }
      } : null)
      
      setMsg({ err: '', ok: 'Pedido pasado a Calidad exitosamente ✔️' })
      
    } catch (error) {
      console.error('❌ Error en pase a calidad:', error)
      setMsg({ err: error.message, ok: '' })
    } finally {
      setProcesandoPase(false)
    }
  }

  // Función auxiliar para formatear fechas de manera segura
  const formatearFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formateando fecha:', error)
      return 'Fecha inválida'
    }
  }

  if (cargando) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-center text-blue-900">
        <p className="text-blue-600">Cargando información del pedido y materiales...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-blue-900">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-900">
        Asignar Materiales - Pedido #{id}
      </h2>
      
      {/* Resumen del Pedido */}
      {pedido && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">Resumen del Pedido</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900 mb-4">
            <div>
              <div className="mb-2">
                <span className="font-medium">Cliente:</span> {pedido.cliente?.nombre} {pedido.cliente?.apellido}
              </div>
              <div className="mb-2">
                <span className="font-medium">Tipo de Prenda:</span> {pedido.tipo}
              </div>
              <div className="mb-2">
                <span className="font-medium">Fecha de Entrega:</span> {formatearFecha(pedido.fechaEntrega)}
              </div>
            </div>
            
            <div>
              <div className="mb-2">
                <span className="font-medium">Estado:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  pedido.estado === 'Calidad' 
                    ? 'bg-green-100 text-green-800' 
                    : pedido.estado === 'Producción'
                    ? 'bg-yellow-100 text-yellow-800'
                    : pedido.estado === 'Completado'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {pedido.estado}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Grupo:</span> {pedido.grupo?.nombre || 'Sin asignar'}
              </div>
              <div className="mb-2">
                <span className="font-medium">Total de Prendas:</span> {pedido.detalles?.reduce((sum, detalle) => sum + detalle.cantidad, 0) || 0}
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
      )}
      
      {/* Mensajes de estado */}
      {msg.err && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          ❌ {msg.err}
        </div>
      )}
      {msg.ok && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          ✅ {msg.ok}
        </div>
      )}

      {/* Tabla de materiales disponibles */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Materiales Disponibles</h3>
        {disp.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-blue-900">
              <thead className="bg-gray-100">
                <tr>
                  {['ID', 'Nombre', 'Tipo', 'Stock Actual', 'Cantidad a Asignar'].map(header => (
                    <th key={header} className="border border-gray-300 p-2 text-left text-blue-900">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disp.map(material => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 font-mono text-blue-900">{material.id}</td>
                    <td className="border border-gray-300 p-2 text-blue-900">{material.nombre}</td>
                    <td className="border border-gray-300 p-2 text-blue-900">{material.tipo}</td>
                    <td className="border border-gray-300 p-2 text-blue-900">
                      <span className={
                        material.cantidad <= material.umbral ? 
                        'text-red-600 font-semibold' : 
                        'text-gray-800'
                      }>
                        {material.cantidad}
                        {material.cantidad <= material.umbral && ' ⚠️'}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2 text-blue-900">
                      <input 
                        type="number" 
                        min="0" 
                        max={material.cantidad}
                        value={cant[material.id] || ''}
                        onChange={e => manejarCambioCantidad(e, material.id)}
                        className="w-24 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                        placeholder="0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-gray-300 rounded p-4 text-center text-gray-500">
            <p>No hay materiales disponibles en el inventario</p>
            <p className="text-sm mt-2">Verifica que existan materiales con stock mayor a 0</p>
          </div>
        )}
      </div>

      {/* Botón de guardar */}
      <button 
        onClick={guardarAsignacion}
        disabled={Object.values(cant).filter(v => v > 0).length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded transition-colors mb-4"
      >
        Guardar Asignación
      </button>

      {/* Botón de Pase a Calidad */}
      <button 
        onClick={manejarPaseACalidad}
        disabled={procesandoPase || pedido?.estado === 'Calidad'}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded transition-colors mb-8"
      >
        {procesandoPase ? 'Procesando...' : 'Pase a Calidad'}
      </button>

      {/* Historial de asignaciones */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3 text-blue-900">Historial de Asignaciones</h3>
        {hist.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto text-blue-900">
            {hist.map((grupo, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50 text-blue-900">
                <div className="mb-2 text-sm text-gray-600">
                  <strong>Fecha:</strong> {formatearFecha(grupo.fecha)}
                </div>
                <div className="space-y-2">
                  {grupo.detalles?.map((detalle, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded">
                      <span>
                        <strong>Material {detalle.codigo}</strong>
                        {detalle.nombreMaterial && ` - ${detalle.nombreMaterial}`}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-semibold">
                        {detalle.cantidad} unidades
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-300 rounded p-4 text-center text-gray-500">
            No hay historial de asignaciones para este pedido
          </div>
        )}
      </div>
    </div>
  )
}
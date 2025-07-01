// src/models/DevolucionModelo.js

// Almacenaje en memoria
const devoluciones = []

// Umbral: si más del X% de prendas se devuelven, se alerta
const UMBRAL_PORCENTAJE = 0.2  // 20%

/**
 * Registra una prenda devuelta
 * @param {{ pedidoId:string, cliente:string, tipoPrenda:string, modelo:string, talla:string, motivo:string, accion:string, totalEsperado:number }} datos
 */
export function registrarDevolucion({ pedidoId, cliente, tipoPrenda, modelo, talla, motivo, accion, totalEsperado }) {
  const devsDePedido = devoluciones.filter(d => d.pedidoId === pedidoId).length + 1
  const porcentaje = devsDePedido / totalEsperado
  const alerta = porcentaje > UMBRAL_PORCENTAJE

  const reg = {
    id: devoluciones.length + 1,
    pedidoId,
    cliente,
    tipoPrenda,
    modelo,
    talla,
    motivo,
    accion,
    fecha: new Date().toISOString(),
    estado: 'RECTIFICACIÓN PENDIENTE',
    alerta
  }
  devoluciones.push(reg)
  return reg
}

/**
 * Actualiza el estado de una devolución a "RECTIFICADO"
 */
export function rectificarDevolucion(id) {
  const d = devoluciones.find(x => x.id === Number(id))
  if (!d) throw new Error('Devolución no encontrada')
  d.estado = 'RECTIFICADO'
  return d
}

/** Obtiene todas las devoluciones de un pedido */
export function obtenerDevoluciones(pedidoId) {
  return devoluciones.filter(d => d.pedidoId === pedidoId)
}

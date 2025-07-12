// src/models/SalidaModelo.js
import prisma from '@/lib/prisma.js'

/**
 * Registra una nueva salida en la tabla billtons.salidas_pedidos.
 * @param {{ pedidoId: number, destino: string, responsableId?: number, cantidad: number }} datos
 */
export function registrarSalida({ pedidoId, destino, responsableId, cantidad }) {
  if (!pedidoId || !destino || cantidad == null) {
    throw new Error('pedidoId, destino y cantidad son obligatorios')
  }
  return prisma.salidaPedido.create({
    data: {
      pedidoId: Number(pedidoId),
      destino,
      responsableId: responsableId ? Number(responsableId) : null,
      cantidad: Number(cantidad)
    }
  })
}

/** Devuelve todas las salidas ordenadas por fecha_salida descendente */
export function obtenerSalidas() {
  return prisma.salidaPedido.findMany({
    orderBy: { fechaSalida: 'desc' }
  })
}

/**
 * Devuelve todas las salidas de un pedido específico.
 * @param {number} pedidoId
 */
export function obtenerSalidasPorPedido(pedidoId) {
  return prisma.salidaPedido.findMany({
    where: { pedidoId: Number(pedidoId) },
    orderBy: { fechaSalida: 'desc' }
  })
}

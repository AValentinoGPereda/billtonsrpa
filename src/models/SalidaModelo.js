// src/models/SalidaModelo.js
import prisma from '@/lib/prisma.js'

/**
 * Registra una nueva salida en la tabla salidas_pedidos.
 * @param {{ pedidoId: number, destino: string, responsableId?: number, cantidad: number }} datos
 */
export async function registrarSalida({ pedidoId, destino, responsableId, cantidad }) {
  if (!pedidoId || !destino || cantidad == null) {
    throw new Error('pedidoId, destino y cantidad son obligatorios')
  }
  
  return await prisma.salidaPedido.create({
    data: {
      pedidoId: Number(pedidoId),
      destino,
      responsableId: responsableId ? Number(responsableId) : null,
      cantidad: Number(cantidad),
      fechaSalida: new Date()
    },
    include: {
      responsable: {
        select: {
          id: true,
          nombre: true,
          apellido: true
        }
      }
    }
  })
}

/** Devuelve todas las salidas ordenadas por fecha_salida descendente */
export async function obtenerSalidas() {
  return await prisma.salidaPedido.findMany({
    include: {
      responsable: {
        select: {
          id: true,
          nombre: true,
          apellido: true
        }
      },
      pedido: {
        select: {
          id: true,
          cliente: {
            select: {
              id: true,
              nombre: true,
              apellido: true
            }
          }
        }
      }
    },
    orderBy: { fechaSalida: 'desc' }
  })
}

/**
 * Devuelve todas las salidas de un pedido específico.
 * @param {number} pedidoId
 */
export async function obtenerSalidasPorPedido(pedidoId) {
  return await prisma.salidaPedido.findMany({
    where: { pedidoId: Number(pedidoId) },
    include: {
      responsable: {
        select: {
          id: true,
          nombre: true,
          apellido: true
        }
      }
    },
    orderBy: { fechaSalida: 'desc' }
  })
}
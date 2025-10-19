// src/models/DevolucionModelo.js
import prisma from '@/lib/prisma'

const UMBRAL_PORCENTAJE = 0.2 // 20%

/**
 * Registra una devolución según el schema Prisma
 */
export async function registrarDevolucion({ 
  pedidoId, 
  clienteId, 
  modelo, 
  defecto, 
  cantidad, 
  accion,
  fechaDevolucion 
}) {
  try {
    // Obtener el pedido para calcular el total de prendas
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        detalles: true,
        _count: {
          select: {
            devoluciones: true
          }
        }
      }
    })

    if (!pedido) {
      throw new Error('Pedido no encontrado')
    }

    // Calcular total de prendas en el pedido
    const totalPrendas = pedido.detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0)

    // Obtener total de devoluciones existentes para este pedido
    const totalDevolucionesExistente = await prisma.devolucion.aggregate({
      where: { pedidoId },
      _sum: {
        cantidad: true
      }
    })

    const totalDevoluciones = totalDevolucionesExistente._sum.cantidad || 0
    const porcentaje = (totalDevoluciones + cantidad) / totalPrendas
    const alerta = porcentaje > UMBRAL_PORCENTAJE

    // Crear la devolución en la base de datos
    const devolucion = await prisma.devolucion.create({
      data: {
        pedidoId,
        clienteId,
        modelo,
        defecto,
        cantidad,
        accion,
        rectificado: false,
        enviadoAlmacen: false,
        fechaDevolucion: new Date(fechaDevolucion)
      },
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true
          }
        }
      }
    })

    // Retornar con alerta virtual (no se guarda en BD)
    return {
      ...devolucion,
      alerta,
      estado: 'RECTIFICACIÓN PENDIENTE', // Virtual para compatibilidad con frontend
      porcentajeDevolucion: porcentaje // Para mostrar en el frontend
    }

  } catch (error) {
    console.error('Error en registrarDevolucion:', error)
    throw new Error(`Error al registrar devolución: ${error.message}`)
  }
}

/**
 * Marcar una devolución como rectificada
 */
export async function rectificarDevolucion(id) {
  try {
    const devolucion = await prisma.devolucion.update({
      where: { id: Number(id) },
      data: { 
        rectificado: true 
      },
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true
          }
        }
      }
    })

    return {
      ...devolucion,
      estado: 'RECTIFICADO', // Virtual para frontend
      fechaRectificacion: new Date().toISOString() // Virtual
    }

  } catch (error) {
    console.error('Error en rectificarDevolucion:', error)
    throw new Error(`Error al rectificar devolución: ${error.message}`)
  }
}

/**
 * Obtener devoluciones de un pedido
 */
export async function obtenerDevoluciones(pedidoId) {
  try {
    const devoluciones = await prisma.devolucion.findMany({
      where: { 
        pedidoId: Number(pedidoId) 
      },
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true
          }
        }
      },
      orderBy: {
        fechaDevolucion: 'desc'
      }
    })

    // Agregar campos virtuales para el frontend
    return devoluciones.map(devolucion => ({
      ...devolucion,
      estado: devolucion.rectificado ? 'RECTIFICADO' : 'RECTIFICACIÓN PENDIENTE'
    }))

  } catch (error) {
    console.error('Error en obtenerDevoluciones:', error)
    throw new Error(`Error al obtener devoluciones: ${error.message}`)
  }
}
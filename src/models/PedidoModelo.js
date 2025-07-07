// src/models/PedidoModelo.js
import prisma from '@/lib/prisma.js'

/**
 * Crea un pedido + nested detalles
 * @param {{ clienteId:number, tipo:string, fechaEntrega:string, grupoId?:number|null,
 *            detalles:Array<{modelo:string,talla:string,cantidad:number}>,
 *            detalleCliente?:string, detalleConfeccion?:string }}
 */
export function crearPedido({
  clienteId,
  tipo,
  fechaEntrega,
  grupoId,
  detalles,
  detalleCliente,
  detalleConfeccion
}) {
  return prisma.pedido.create({
    data: {
      clienteId,
      tipo,
      fechaEntrega: new Date(fechaEntrega),
      grupoId: grupoId ?? undefined,
      estado: 'Producción',
      detalles: {
        create: detalles.map(d => ({
          modelo: d.modelo,
          talla: d.talla,
          cantidad: d.cantidad
        }))
      },
      // columnas extras asumidas en tu DDL:
      detalle_cliente: detalleCliente,
      detalle_confeccion: detalleConfeccion
    },
    include: {
      detalles: true
    }
  })
}

export function listarPedidos() {
  return prisma.pedido.findMany({
    orderBy: { fechaCreacion: 'desc' },
    include: { cliente: true, detalles: true }
  })
}

export function listarPedidosAsignados() {
  return prisma.pedido.findMany({
    where: { estado: 'Producción' },
    orderBy: { fechaCreacion: 'desc' },
    include: { cliente: true }
  })
}

export function verPedido(id) {
  return prisma.pedido.findUnique({
    where: { id: Number(id) },
    include: {
      cliente: true,
      detalles: true,
      asignaciones: { include: { material: true } },
      controlCalidad: { include: { defectosPedido: true } },
      devoluciones: true,
      salidas: true
    }
  })
}

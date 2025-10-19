// src/app/api/pedidos/[id]/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { id } = params
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'ID de pedido inválido' }, { status: 400 })
    }

    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(id) },
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true
          }
        },
        grupo: {
          select: {
            id: true,
            nombre: true
          }
        },
        detalles: true
      }
    })

    if (!pedido) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    // Convertir a objeto simple para evitar problemas de serialización
    const responseData = {
      id: pedido.id,
      clienteId: pedido.clienteId,
      tipo: pedido.tipo,
      fechaCreacion: pedido.fechaCreacion,
      fechaEntrega: pedido.fechaEntrega,
      estado: pedido.estado,
      grupoId: pedido.grupoId,
      detalle_cliente: pedido.detalle_cliente,
      detalle_confeccion: pedido.detalle_confeccion,
      cliente: pedido.cliente,
      grupo: pedido.grupo, // Esto debería traer el grupo con id y nombre
      detalles: pedido.detalles
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error en GET /api/pedidos/[id]:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
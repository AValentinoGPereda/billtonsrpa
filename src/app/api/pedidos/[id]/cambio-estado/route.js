// src/app/api/pedidos/[id]/cambio-estado/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const pedidoId = Number(id)

    if (!pedidoId || isNaN(pedidoId)) {
      return NextResponse.json(
        { error: 'ID de pedido inválido' },
        { status: 400 }
      )
    }

    const { estado, grupoId } = await request.json()

    if (!estado) {
      return NextResponse.json(
        { error: 'El campo estado es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id: pedidoId }
    })

    if (!pedidoExistente) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    // Si se envía grupoId, verificar que el grupo existe
    let grupoData = null
    if (grupoId) {
      grupoData = await prisma.grupo.findUnique({
        where: { id: grupoId }
      })

      if (!grupoData) {
        return NextResponse.json(
          { error: `Grupo con ID ${grupoId} no encontrado` },
          { status: 404 }
        )
      }
    }

    // Preparar datos para actualización
    const dataActualizacion = {
      estado: estado
    }

    // Solo actualizar grupoId si se proporciona
    if (grupoId !== undefined) {
      dataActualizacion.grupoId = grupoId
    }

    // Actualizar el pedido
    const pedidoActualizado = await prisma.pedido.update({
      where: { id: pedidoId },
      data: dataActualizacion,
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

    // Convertir a objeto simple para evitar problemas de serialización
    const responseData = {
      id: pedidoActualizado.id,
      estado: pedidoActualizado.estado,
      grupoId: pedidoActualizado.grupoId,
      cliente: pedidoActualizado.cliente,
      grupo: pedidoActualizado.grupo,
      detalles: pedidoActualizado.detalles,
      tipo: pedidoActualizado.tipo,
      fechaEntrega: pedidoActualizado.fechaEntrega,
      detalle_cliente: pedidoActualizado.detalle_cliente,
      detalle_confeccion: pedidoActualizado.detalle_confeccion
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('❌ Error en PUT /api/pedidos/[id]/cambio-estado:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
// src/app/api/pedidos/[id]/salida/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const salidas = await prisma.salidaPedido.findMany({
      where: { pedidoId: Number(params.id) },
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
    return NextResponse.json(salidas)
  } catch (error) {
    console.error('[GET salida]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const pedidoId = Number(params.id)
    
    // Obtener el pedido para validar
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        detalles: true,
        salidas: true
      }
    })

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    const { destino, responsableId, cantidad } = await request.json()
    
    // Validaciones
    if (!destino || !responsableId || !cantidad) {
      return NextResponse.json(
        { error: 'Destino, responsable y cantidad son obligatorios' },
        { status: 400 }
      )
    }

    if (Number(cantidad) <= 0) {
      return NextResponse.json(
        { error: 'La cantidad debe ser mayor a 0' },
        { status: 400 }
      )
    }

    // Calcular total ya despachado
    const totalDespachado = pedido.salidas.reduce((sum, salida) => sum + salida.cantidad, 0)
    const totalPedido = pedido.detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0)
    const disponible = totalPedido - totalDespachado

    if (Number(cantidad) > disponible) {
      return NextResponse.json(
        { error: `Cantidad excede el disponible. Máximo: ${disponible} prendas` },
        { status: 400 }
      )
    }

    // Verificar si el responsable existe y no es rol 1
    const responsable = await prisma.trabajador.findUnique({
      where: { id: Number(responsableId) },
      include: { roles: true }
    })

    if (!responsable) {
      return NextResponse.json(
        { error: 'Responsable no encontrado' },
        { status: 404 }
      )
    }

    if (responsable.rol_id === 1) {
      return NextResponse.json(
        { error: 'El responsable seleccionado no tiene permisos para esta operación' },
        { status: 400 }
      )
    }

    // Crear la salida
    const salida = await prisma.salidaPedido.create({
      data: {
        pedidoId,
        destino,
        responsableId: Number(responsableId),
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

    // Actualizar estado del pedido a "Despachado" si se despacha la cantidad total
    const nuevoTotalDespachado = totalDespachado + Number(cantidad)
    if (nuevoTotalDespachado >= totalPedido) {
      await prisma.pedido.update({
        where: { id: pedidoId },
        data: { estado: 'Despachado' }
      })
    }

    // TODO: Aquí iría la lógica para descontar del inventario
    // según el criterio de aceptación

    return NextResponse.json(salida, { status: 201 })
  } catch (error) {
    console.error('[POST salida]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
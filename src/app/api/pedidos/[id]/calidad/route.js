// src/app/api/pedidos/[id]/calidad/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma.js'

/**
 * GET /api/pedidos/:id/calidad
 * Devuelve el historial de inspecciones para el pedido.
 */
export async function GET(request, { params }) {
  try {
    const historial = await prisma.controlCalidad.findMany({
      where: { pedidoId: Number(params.id) },
      orderBy: { fechaControl: 'desc' },
      include: {
        defectosPedido: true
      }
    })
    return NextResponse.json(historial)
  } catch (e) {
    console.error('[GET calidad]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/**
 * POST /api/pedidos/:id/calidad
 * Registra una nueva inspección de calidad.
 * Body JSON: { aprobadas: number, rechazadas: number }
 */
export async function POST(request, { params }) {
  try {
    const pedidoId = Number(params.id)
    
    // Obtener el pedido para validar el total
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        detalles: true
      }
    })

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    const totalEsperado = pedido.detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0)

    const { aprobadas, rechazadas } = await request.json()
    
    if (typeof aprobadas !== 'number' || aprobadas < 0) {
      return NextResponse.json(
        { error: 'Campo aprobadas debe ser un número ≥ 0' },
        { status: 400 }
      )
    }

    if (typeof rechazadas !== 'number' || rechazadas < 0) {
      return NextResponse.json(
        { error: 'Campo rechazadas debe ser un número ≥ 0' },
        { status: 400 }
      )
    }

    // Validar que la suma sea igual al total esperado
    if (aprobadas + rechazadas !== totalEsperado) {
      return NextResponse.json(
        { error: `La suma de aprobadas y rechazadas (${aprobadas + rechazadas}) debe ser igual al total esperado (${totalEsperado})` },
        { status: 400 }
      )
    }

    // Determinar estado: EVALUACIÓN si hay rechazadas, FINALIZADO si no hay rechazadas
    const estado = rechazadas > 0 ? 'EVALUACIÓN' : 'FINALIZADO'

    // Crear el registro en control_calidad
    const nuevaInspeccion = await prisma.controlCalidad.create({
      data: {
        pedidoId,
        estado,
        aprobadas,
        rechazadas,
        rectificadas: 0, // Inicialmente 0, se actualiza cuando se rectifica
        fechaControl: new Date()
      },
      include: {
        defectosPedido: true
      }
    })

    return NextResponse.json(nuevaInspeccion, { status: 201 })
  } catch (e) {
    console.error('[POST calidad]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/**
 * PUT /api/pedidos/[id]/calidad
 * Marca una inspección como rectificada
 * Body JSON: { inspeccionId: number }
 */
export async function PUT(request, { params }) {
  try {
    const { inspeccionId } = await request.json()
    
    if (!inspeccionId) {
      return NextResponse.json(
        { error: 'Falta el ID de la inspección' },
        { status: 400 }
      )
    }

    // Buscar la inspección
    const inspeccion = await prisma.controlCalidad.findUnique({
      where: { id: Number(inspeccionId) }
    })

    if (!inspeccion) {
      return NextResponse.json(
        { error: 'Inspección no encontrada' },
        { status: 404 }
      )
    }

    // Validar que tenga rechazadas para rectificar
    if (inspeccion.rechazadas === 0) {
      return NextResponse.json(
        { error: 'No hay prendas rechazadas para rectificar' },
        { status: 400 }
      )
    }

    // Actualizar: rechazadas = 0, rectificadas = rectificadas + rechazadas, estado = FINALIZADO
    const inspeccionActualizada = await prisma.controlCalidad.update({
      where: { id: Number(inspeccionId) },
      data: {
        rechazadas: 0, // Las rechazadas pasan a 0
        rectificadas: inspeccion.rectificadas + inspeccion.rechazadas, // Se suman a rectificadas
        estado: 'FINALIZADO'
      },
      include: {
        defectosPedido: true
      }
    })

    return NextResponse.json(inspeccionActualizada)
  } catch (e) {
    console.error('[PUT calidad]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
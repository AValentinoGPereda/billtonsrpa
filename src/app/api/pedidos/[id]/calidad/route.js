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
      select: {
        id: true,
        fechaControl: true,
        estado: true,
        aprobadas: true,
        rechazadas: true,
        rectificadas: true
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
 * Espera en header 'x-total-esperado' el total de prendas esperadas.
 * Body JSON: { aprobadas: number, rectificadas: number }
 */
export async function POST(request, { params }) {
  try {
    const pedidoId = Number(params.id)
    const totalEsperado = Number(request.headers.get('x-total-esperado'))
    if (isNaN(totalEsperado)) {
      return NextResponse.json(
        { error: 'Falta o es inválido el header x-total-esperado' },
        { status: 400 }
      )
    }

    const { aprobadas, rectificadas } = await request.json()
    if (
      typeof aprobadas !== 'number' ||
      typeof rectificadas !== 'number' ||
      aprobadas < 0 ||
      rectificadas < 0
    ) {
      return NextResponse.json(
        { error: 'Campos aprobadas y rectificadas deben ser números ≥ 0' },
        { status: 400 }
      )
    }

    // Calcula rechazadas automáticamente
    const rechazadas = totalEsperado - aprobadas

    // Determina estado: EVALUACIÓN si rectificadas < rechazadas, FINALIZADO si igualan
    const estado =
      rectificadas < rechazadas ? 'EVALUACIÓN' : 'FINALIZADO'

    // Crea el registro en control_calidad
    const nuevaInspeccion = await prisma.controlCalidad.create({
      data: {
        pedidoId,
        estado,
        aprobadas,
        rechazadas,
        rectificadas
      }
    })

    return NextResponse.json(nuevaInspeccion, { status: 201 })
  } catch (e) {
    console.error('[POST calidad]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// src/app/api/pedidos/[id]/calidad/route.js
import { NextResponse } from 'next/server'
import {
  crearInspeccion,
  listarInspecciones
} from '@/controllers/CalidadControlador'

export async function GET(request, { params }) {
  const historial = listarInspecciones(params.id)
  return NextResponse.json(historial)
}

export async function POST(request, { params }) {
  try {
    const { aprobadas, rectificadas } = await request.json()
    const totalEsperado = Number(request.headers.get('x-total-esperado'))
    if (isNaN(totalEsperado)) {
      throw new Error('Falta el total esperado en la cabecera')
    }
    const nueva = crearInspeccion({
      pedidoId: params.id,
      totalEsperado,
      aprobadas,
      rectificadas
    })
    return NextResponse.json(nueva, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

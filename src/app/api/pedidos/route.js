// src/app/api/pedidos/route.js
import { NextResponse } from 'next/server'
import {
  registrarPedido,
  obtenerTodosPedidos
} from '@/controllers/PedidoControlador.js'

export async function GET() {
  const pedidos = await obtenerTodosPedidos()
  return NextResponse.json(pedidos)
}

export async function POST(request) {
  try {
    const body = await request.json()
    // validaciones mínimas
    const { clienteId, tipo, fechaEntrega, detalles } = body
    if (!clienteId || !tipo || !fechaEntrega || !Array.isArray(detalles) || detalles.length === 0) {
      return NextResponse.json({ error: 'Campos obligatorios faltantes' }, { status: 400 })
    }
    const nuevo = await registrarPedido(body)
    return NextResponse.json(nuevo, { status: 201 })
  } catch (e) {
    console.error('[POST /api/pedidos]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}


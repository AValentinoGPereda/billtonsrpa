// src/app/api/pedidos/registro/route.js
import { NextResponse } from 'next/server'
import { registrarPedido } from '@/controllers/PedidoControlador.js'

// POST /api/pedidos/registro
export async function POST(request) {
  try {
    const { clienteId, tipo, fechaEntrega, grupoId } = await request.json()
    if (!clienteId || !tipo || !fechaEntrega) {
      return NextResponse.json(
        { error: 'clienteId, tipo y fechaEntrega son obligatorios' },
        { status: 400 }
      )
    }
    const pedido = await registrarPedido({ clienteId, tipo, fechaEntrega, grupoId })
    return NextResponse.json(pedido, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

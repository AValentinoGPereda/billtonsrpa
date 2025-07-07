// src/app/api/pedidos/[id]/route.js
import { NextResponse } from 'next/server'
import { obtenerPedidoDetalle } from '@/controllers/PedidoControlador.js'

export async function GET(request, { params }) {
  const pedido = await obtenerPedidoDetalle(params.id)
  if (!pedido) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  }
  return NextResponse.json(pedido)
}

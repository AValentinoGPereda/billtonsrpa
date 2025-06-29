// src/app/api/pedidos/[id]/route.js
import { NextResponse } from 'next/server'
import { verPedido } from '@controllers/PedidoControlador'

export async function GET(request, { params }) {
  const { id } = params
  const pedido = verPedido(id)
  if (!pedido) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  }
  return NextResponse.json(pedido)
}

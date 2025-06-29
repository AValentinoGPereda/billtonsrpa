// src/app/api/pedidos/route.js
import { NextResponse } from 'next/server'
import { listarPedidos } from '@controllers/PedidoControlador'

export async function GET() {
  const lista = listarPedidos()
  return NextResponse.json(lista)
}

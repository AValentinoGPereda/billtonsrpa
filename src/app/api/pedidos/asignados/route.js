// src/app/api/pedidos/asignados/route.js
import { NextResponse } from 'next/server'
import { obtenerPedidosAsignados } from '@/controllers/PedidoControlador.js'

export async function GET() {
  const asignados = await obtenerPedidosAsignados()
  return NextResponse.json(asignados)
}

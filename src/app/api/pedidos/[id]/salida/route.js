// src/app/api/pedidos/[id]/salida/route.js
import { NextResponse } from 'next/server'
import { crearSalida, listarSalidasPedido } from '@/controllers/SalidaControlador'

export async function GET(request, { params }) {
  const lista = listarSalidasPedido(params.id)
  return NextResponse.json(lista)
}

export async function POST(request, { params }) {
  try {
    const { destino, responsable, cantidad } = await request.json()
    if (!destino || !responsable || isNaN(Number(cantidad))) {
      throw new Error('Destino, responsable y cantidad son obligatorios')
    }
    const nueva = crearSalida({
      pedidoId: params.id,
      destino,
      responsable,
      cantidad: Number(cantidad)
    })
    return NextResponse.json(nueva, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

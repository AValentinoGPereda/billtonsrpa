// src/app/api/pedidos/[id]/devoluciones/route.js
import { NextResponse } from 'next/server'
import {
  listarDevoluciones,
  crearDevolucion,
  actualizarDevolucion
} from '@/controllers/DevolucionControlador.js'

export async function GET(request, { params }) {
  const lista = listarDevoluciones(Number(params.id))
  return NextResponse.json(lista)
}

export async function POST(request, { params }) {
  try {
    const { clienteId, modelo, defecto, cantidad, accion } = await request.json()
    if (!clienteId || !cantidad || !accion) {
      throw new Error('Datos de devolución incompletos')
    }
    const dev = crearDevolucion({
      pedidoId: Number(params.id),
      clienteId,
      modelo,
      defecto,
      cantidad,
      accion
    })
    return NextResponse.json(dev, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { devolucionId } = await request.json()
    if (!devolucionId) throw new Error('Falta devolucionId')
    const updated = actualizarDevolucion(Number(devolucionId))
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

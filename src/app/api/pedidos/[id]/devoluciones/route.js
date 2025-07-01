// src/app/api/pedidos/[id]/devoluciones/route.js
import { NextResponse } from 'next/server'
import {
  crearDevolucion,
  actualizarDevolucion,
  listarDevoluciones
} from '@/controllers/DevolucionControlador'

export async function GET(request, { params }) {
  const lista = listarDevoluciones(params.id)
  return NextResponse.json(lista)
}

export async function POST(request, { params }) {
  try {
    const {
      cliente, tipoPrenda, modelo,
      talla, motivo, accion
    } = await request.json()
    const totalEsperado = Number(request.headers.get('x-total-esperado'))
    if (!cliente || !tipoPrenda || !modelo || !talla || !motivo || !accion) {
      throw new Error('Todos los campos son obligatorios')
    }
    const nueva = crearDevolucion({
      pedidoId: params.id,
      cliente, tipoPrenda, modelo,
      talla, motivo, accion,
      totalEsperado
    })
    return NextResponse.json(nueva, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { idDevolucion } = await request.json()
    const actual = actualizarDevolucion(idDevolucion)
    return NextResponse.json(actual)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

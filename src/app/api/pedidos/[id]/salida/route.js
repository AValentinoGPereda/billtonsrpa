// src/app/api/pedidos/[id]/salida/route.js
import { NextResponse } from 'next/server'
import {
  crearSalida,    // suponiendo que tienes funciones en SalidaControlador
  listarSalidas   // y en tu modelo SaleModel
} from '@/controllers/SalidaControlador.js'

export async function GET(request, { params }) {
  const lista = listarSalidas(Number(params.id))
  return NextResponse.json(lista)
}

export async function POST(request, { params }) {
  try {
    const { destino, responsableId, cantidad } = await request.json()
    if (!destino || !responsableId || !cantidad) {
      throw new Error('Datos de salida incompletos')
    }
    const salida = crearSalida({
      pedidoId: Number(params.id),
      destino,
      responsableId,
      cantidad
    })
    return NextResponse.json(salida, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

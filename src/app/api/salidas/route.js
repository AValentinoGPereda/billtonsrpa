// src/app/api/salidas/route.js
import { NextResponse } from 'next/server'
import { listarSalidas, crearSalida } from '@/controllers/SalidaControlador.js'

export async function GET() {
  try {
    const salidas = await listarSalidas()
    return NextResponse.json(salidas)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const datos = await request.json()
    const nueva = await crearSalida(datos)
    return NextResponse.json(nueva, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

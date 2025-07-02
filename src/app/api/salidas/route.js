// src/app/api/salidas/route.js
import { NextResponse } from 'next/server'
import { listarSalidas } from '@/controllers/SalidaControlador'

export async function GET() {
  const lista = listarSalidas()
  return NextResponse.json(lista)
}

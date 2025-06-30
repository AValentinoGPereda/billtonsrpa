import { NextResponse } from 'next/server'
import { listarInventario } from '@controllers/InventarioControlador'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const filtro = searchParams.get('q') || ''
  const lista = listarInventario(filtro)
  return NextResponse.json(lista)
}

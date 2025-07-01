// src/app/api/inventario/route.js
import { NextResponse } from 'next/server'
import {
  listarInventario,
  verMaterial,
  editarMaterial
} from '@controllers/InventarioControlador'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const filtro = searchParams.get('q') || ''
  const lista = listarInventario(filtro)
  return NextResponse.json(lista)
}

export async function PUT(request) {
  try {
    const { codigo, nombre, stock, ubicacion } = await request.json()
    if (!codigo) {
      return NextResponse.json({ error: 'El código es obligatorio' }, { status: 400 })
    }
    const actualizado = editarMaterial({ codigo, nombre, stock, ubicacion })
    return NextResponse.json({ mensaje: 'Stock actualizado', material: actualizado })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function POST(request) {
  // opcional: registrar nuevo material
  return NextResponse.json({ error: 'POST no soportado aquí' }, { status: 405 })
}

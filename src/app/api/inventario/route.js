// src/app/api/inventario/route.js
import { NextResponse } from 'next/server'
import {
  listarInventario,
  verMaterial, // Asegúrate de importar verMaterial
  editarMaterial,
  registrarMaterial
} from '@controllers/InventarioControlador'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const filtro = searchParams.get('q') || ''
  const id = searchParams.get('id') // Nuevo: obtener el parámetro id
  
  // Si se proporciona un ID, buscar ese material específico
  if (id) {
    try {
      const material = await verMaterial(id)
      if (!material) {
        return NextResponse.json({ error: 'Material no encontrado' }, { status: 404 })
      }
      return NextResponse.json(material)
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }
  }
  
  // Si no hay ID, hacer la búsqueda general
  try {
    const lista = await listarInventario(filtro)
    return NextResponse.json(lista)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

// El resto de tu código PUT y POST permanece igual
export async function PUT(request) {
  try {
    const { id, nombre, tipo, cantidad, umbral, color, ubicacion } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'El id es obligatorio' }, { status: 400 })
    }
    const actualizado = await editarMaterial({ id, nombre, tipo, cantidad, umbral, color, ubicacion })
    return NextResponse.json({ mensaje: 'Stock actualizado', material: actualizado })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function POST(request) {
  try {
    const { nombre, tipo, cantidad, umbral, color, ubicacion } = await request.json()
    if (!nombre || !tipo) {
      return NextResponse.json({ error: 'Nombre y tipo son obligatorios' }, { status: 400 })
    }
    const creado = await registrarMaterial({ nombre, tipo, cantidad, umbral, color, ubicacion })
    return NextResponse.json({ mensaje: 'Material registrado', material: creado })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
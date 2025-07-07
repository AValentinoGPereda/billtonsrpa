// src/app/api/pedidos/[id]/asignar-materiales/route.js
import { NextResponse } from 'next/server'
import {
  listarDisponibles,
  historialAsignaciones,
  crearAsignacion
} from '@/controllers/AsignacionMaterialControlador.js'

export async function GET(request, { params }) {
  const disponibles = listarDisponibles()
  const historial = historialAsignaciones(Number(params.id))
  return NextResponse.json({ disponibles, historial })
}

export async function POST(request, { params }) {
  try {
    const { asignaciones } = await request.json()
    if (!Array.isArray(asignaciones) || asignaciones.length === 0) {
      throw new Error('No hay asignaciones válidas')
    }
    const registro = crearAsignacion(Number(params.id), asignaciones)
    return NextResponse.json(registro, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

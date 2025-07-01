import { NextResponse } from 'next/server'
import {
  listarDisponibles,
  crearAsignacion,
  historialAsignaciones
} from '@controllers/AsignacionMaterialControlador'

export async function GET(request, { params }) {
  // Listar materiales + historial juntos
  const disponibles = listarDisponibles()
  const historial = historialAsignaciones(params.id)
  return NextResponse.json({ disponibles, historial })
}

export async function POST(request, { params }) {
  try {
    const { asignaciones } = await request.json()
    if (!Array.isArray(asignaciones) || asignaciones.length === 0) {
      throw new Error('Lista de asignaciones vacía')
    }
    const registro = crearAsignacion(params.id, asignaciones)
    return NextResponse.json({ mensaje: 'Materiales asignados', registro })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

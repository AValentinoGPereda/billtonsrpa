// src/app/api/pedidos/[id]/asignar-materiales/route.js
import { NextResponse } from 'next/server'
import {
  listarDisponibles,
  historialAsignaciones,
  crearAsignacion
} from '@/controllers/AsignacionMaterialControlador'

export async function GET(request, { params }) {
  try {
    console.log('🔍 Solicitando materiales para pedido:', params.id)
    
    const [disponibles, historial] = await Promise.all([
      listarDisponibles(),
      historialAsignaciones(Number(params.id))
    ])
    
    console.log('📦 Materiales disponibles:', disponibles)
    console.log('📋 Historial encontrado:', historial)
    
    return NextResponse.json({ 
      disponibles, 
      historial 
    })
  } catch (error) {
    console.error('❌ Error en GET asignar-materiales:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}

export async function POST(request, { params }) {
  try {
    const { asignaciones } = await request.json()
    
    if (!Array.isArray(asignaciones) || asignaciones.length === 0) {
      return NextResponse.json(
        { error: 'No hay asignaciones válidas' }, 
        { status: 400 }
      )
    }

    const registro = await crearAsignacion(Number(params.id), asignaciones)
    return NextResponse.json(registro, { status: 201 })
    
  } catch (error) {
    console.error('❌ Error en POST asignar-materiales:', error)
    return NextResponse.json(
      { error: error.message }, 
      { status: 400 }
    )
  }
}
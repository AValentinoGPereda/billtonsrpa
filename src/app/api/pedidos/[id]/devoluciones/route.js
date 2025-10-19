// src/app/api/pedidos/[id]/devoluciones/route.js
import { NextResponse } from 'next/server'
import {
  listarDevoluciones,
  crearDevolucion,
  actualizarDevolucion
} from '@/controllers/DevolucionControlador'

export async function GET(request, { params }) {
  try {
    const { id } = params
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'ID de pedido inválido' }, { status: 400 })
    }

    const lista = await listarDevoluciones(Number(id))
    return NextResponse.json(lista)
  } catch (error) {
    console.error('Error en GET /api/pedidos/[id]/devoluciones:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'ID de pedido inválido' }, { status: 400 })
    }

    const { 
      clienteId, 
      modelo, 
      defecto, 
      cantidad, 
      accion,
      fechaDevolucion 
    } = await request.json()

    const devolucion = await crearDevolucion({
      pedidoId: Number(id),
      clienteId: Number(clienteId),
      modelo: modelo?.toString() || '',
      defecto: defecto?.toString() || '',
      cantidad: Number(cantidad),
      accion: accion?.toString() || '',
      fechaDevolucion: fechaDevolucion || new Date().toISOString()
    })

    // Actualizar el estado del pedido a "En rectificación" y grupo a 5
    const pedidoActualizado = await prisma.pedido.update({
      where: { id: Number(id) },
      data: {
        estado: 'En rectificación',
        grupoId: 5
      },
      include: {
        cliente: true,
        grupo: true,
        detalles: true
      }
    })

    return NextResponse.json(devolucion, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/pedidos/[id]/devoluciones:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
export async function PUT(request, { params }) {
  try {
    const { devolucionId } = await request.json()
    
    if (!devolucionId || isNaN(Number(devolucionId))) {
      return NextResponse.json({ error: 'ID de devolución inválido' }, { status: 400 })
    }

    const updated = await actualizarDevolucion(Number(devolucionId))
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error en PUT /api/pedidos/[id]/devoluciones:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
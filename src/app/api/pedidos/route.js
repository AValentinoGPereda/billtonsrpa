// src/app/api/pedidos/route.js
import { NextResponse } from 'next/server'
import {
  registrarPedido,
  obtenerTodosPedidos
} from '@/controllers/PedidoControlador.js'

export async function GET() {
  const pedidos = await obtenerTodosPedidos()
  return NextResponse.json(pedidos)
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Extrae todos los campos necesarios
    const { clienteId, tipo, fechaEntrega, detalles, detalleCliente, detalleConfeccion } = body
    
    // Validaciones
    if (!clienteId || !tipo || !fechaEntrega || !Array.isArray(detalles) || detalles.length === 0) {
      return NextResponse.json({ error: 'Campos obligatorios faltantes' }, { status: 400 })
    }
    
    // Pasa todos los campos al controlador
    const nuevo = await registrarPedido({
      clienteId,
      tipo,
      fechaEntrega,
      detalles,
      detalleCliente: detalleCliente || "No tiene detalles adicionales",
      detalleConfeccion: detalleConfeccion || "Sin estampado"
    })
    
    return NextResponse.json(nuevo, { status: 201 })
  } catch (e) {
    console.error('[POST /api/pedidos]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
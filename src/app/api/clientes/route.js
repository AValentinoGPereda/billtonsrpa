// src/app/api/clientes/route.js
import { NextResponse } from 'next/server'
import { registrarCliente, listarClientes } from '@/controllers/ClienteControlador.js'

/**
 * GET /api/clientes
 * Devuelve siempre un array (vacío si hay error interno)
 */
export async function GET() {
  try {
    const clientes = await listarClientes()
    return NextResponse.json(Array.isArray(clientes) ? clientes : [])
  } catch (e) {
    console.error('[GET /api/clientes] Error interno:', e)
    // Devolvemos array vacío para no romper el front-end
    return NextResponse.json([], { status: 200 })
  }
}

/**
 * POST /api/clientes
 * Crea un nuevo cliente y devuelve { mensaje, cliente }
 */
export async function POST(request) {
  try {
    const { nombre, apellido, correo, celular } = await request.json()

    // Validación básica
    if (!nombre || !apellido || !correo || !celular) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    const cliente = await registrarCliente({ nombre, apellido, correo, celular })
    return NextResponse.json(
      { mensaje: 'Cliente registrado', cliente },
      { status: 201 }
    )
  } catch (e) {
    console.error('[POST /api/clientes] Error al crear:', e)
    const status = e.message.includes('Unique') ? 409 : 500
    return NextResponse.json(
      { error: e.message },
      { status }
    )
  }
}

//src\app\api\clientes\[id]\route.js
import { NextResponse } from 'next/server'
import { modificarCliente, borrarCliente } from '@/controllers/ClienteControlador.js'

export async function PUT(request, { params }) {
  try {
    const id = params.id
    const { nombre, apellido, correo, celular } = await request.json()
    if (!nombre || !apellido || !correo || !celular) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }
    const cliente = await modificarCliente(id, { nombre, apellido, correo, celular })
    return NextResponse.json(
      { mensaje: 'Cliente actualizado', cliente },
      { status: 200 }
    )
  } catch (e) {
    console.error('[PUT /api/clientes/[id]] Error:', e)
    const status = e.message.includes('Record to update not found') ? 404 : 500
    return NextResponse.json(
      { error: e.message },
      { status }
    )
  }
}
export async function DELETE(request, { params }) {
  try {
    const id = params.id
    await borrarCliente(id)
    return NextResponse.json(
      { mensaje: 'Cliente eliminado' },
      { status: 200 }
    )
  } catch (e) {
    console.error('[DELETE /api/clientes/[id]] Error:', e)
    const status = e.message.includes('Record to delete does not exist') ? 404 : 500
    return NextResponse.json(
      { error: e.message },
      { status }
    )
  }
}
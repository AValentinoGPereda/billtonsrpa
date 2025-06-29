import { NextResponse } from 'next/server'
import { registrarCliente, listarClientes } from '@controllers/ClienteControlador'

export async function POST(request) {
  const { nombre, correo, celular } = await request.json()
  // ...validaciones...
  try {
    const cliente = await registrarCliente({ nombre, correo, celular })
    return NextResponse.json({ mensaje: 'Cliente registrado', cliente }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 409 })
  }
}

export async function GET() {
  const lista = await listarClientes()
  return NextResponse.json(lista)
}

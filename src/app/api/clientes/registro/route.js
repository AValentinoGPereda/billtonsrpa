import { NextResponse } from 'next/server'
import { registrarCliente, listarClientes } from '@controllers/ClienteControlador'

export async function POST(request) {
  const { nombre, correo, celular } = await request.json()

  // Validaciones básicas
  if (!nombre || !correo || !celular) {
    return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 })
  }
  // Formato email
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRx.test(correo)) {
    return NextResponse.json({ error: 'Formato de correo inválido.' }, { status: 400 })
  }
  // Celular numérico
  if (!/^\d{7,15}$/.test(celular)) {
    return NextResponse.json({ error: 'Número de celular inválido.' }, { status: 400 })
  }

  try {
    const cliente = registrarCliente({ nombre, correo, celular })
    return NextResponse.json({ mensaje: 'Cliente registrado', cliente }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 409 })
  }
}

// También permitimos listar desde este endpoint
export async function GET() {
  const lista = listarClientes()
  return NextResponse.json(lista)
}

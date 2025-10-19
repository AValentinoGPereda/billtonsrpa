// src/app/api/users/route.js
import { NextResponse } from 'next/server'
import {
  registrarUsuario,
  listarUsuarios
} from '@/controllers/UsuarioControlador.js'

export async function POST(request) {
  try {
    const { nombre, usuario, email, contraseña, confirmar, rol } = await request.json()

    // Validaciones
    if (!nombre || !usuario || !email || !contraseña || !confirmar || !rol) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 })
    }
    if (contraseña !== confirmar) {
      return NextResponse.json({ error: 'Las contraseñas no coinciden.' }, { status: 400 })
    }

    const nuevo = await registrarUsuario({ nombre, usuario, email, contraseña, rol })
    return NextResponse.json({ mensaje: 'Trabajador registrado', usuario: nuevo }, { status: 201 })

  } catch (e) {
    const status = e.message.includes('no encontrado') ? 400 : 409
    return NextResponse.json({ error: e.message }, { status })
  }
}

export async function GET() {
  const lista = await listarUsuarios()
  return NextResponse.json(lista)
}

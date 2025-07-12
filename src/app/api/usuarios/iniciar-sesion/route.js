// src/app/api/usuarios/iniciar-sesion/route.js
import { NextResponse } from 'next/server'
import { iniciarSesion } from '@/controllers/AutenticacionControlador.js'

export async function POST(request) {
  try {
    const { usuario, contraseña } = await request.json()
    if (!usuario || !contraseña) {
      return NextResponse.json(
        { error: 'Usuario y contraseña obligatorios.' },
        { status: 400 }
      )
    }

    const user = await iniciarSesion({ usuario, contraseña })
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas.' },
        { status: 401 }
      )
    }

    // Retornamos solo lo necesario
    return NextResponse.json(
      {
        mensaje: 'Inicio de sesión exitoso',
        usuario: { id: user.id, nombre: user.nombre, rol: user.rol_id }
      },
      { status: 200 }
    )
  } catch (e) {
    // Nunca respondas HTML ni dejes que el error salte sin JSON
    return NextResponse.json(
      { error: 'Error interno: ' + e.message },
      { status: 500 }
    )
  }
}

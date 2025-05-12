// src/app/api/usuarios/registro/route.js
import { NextResponse } from 'next/server'
import { registrarUsuario, listarUsuarios } from '@controllers/UsuarioControlador'

// POST /api/usuarios/registro
export async function POST(request) {
  const { nombre, usuario, email, contraseña, confirmar, rol } = await request.json()

  // Validaciones de negocio
  if (!nombre || !usuario || !email || !contraseña || !confirmar || !rol) {
    return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 })
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
  if (!passwordRegex.test(contraseña)) {
    return NextResponse.json({
      error: 'La contraseña debe tener mínimo 8 caracteres, al menos un número y una letra mayúscula.'
    }, { status: 400 })
  }
  if (contraseña !== confirmar) {
    return NextResponse.json({ error: 'Las contraseñas no coinciden.' }, { status: 400 })
  }
  // Validar formato de correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Formato de email inválido.' }, { status: 400 })
  }

  // Registrar
  const nuevo = registrarUsuario({ nombre, usuario, email, contraseña, rol })
  return NextResponse.json({ mensaje: 'Se registró al Trabajador', usuario: nuevo }, { status: 201 })
}

// GET /api/usuarios/registro   → para listar usuarios si lo necesitas
export async function GET() {
  const lista = listarUsuarios()
  return NextResponse.json(lista)
}

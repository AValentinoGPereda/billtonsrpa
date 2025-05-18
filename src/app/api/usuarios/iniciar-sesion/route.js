import { NextResponse } from 'next/server'
import { iniciarSesion } from '@controllers/AutenticacionControlador'

export async function POST(request) {
  const { usuario, contraseña } = await request.json()
  if (!usuario || !contraseña) {
    return NextResponse.json({ error: 'Usuario y contraseña obligatorios.' }, { status: 400 })
  }
  const user = iniciarSesion({ usuario, contraseña })
  if (!user) {
    return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 })
  }
  return NextResponse.json({
    mensaje: 'Inicio de sesión exitoso',
    usuario: { id: user.id, nombre: user.nombre, rol: user.rol }
  })
}

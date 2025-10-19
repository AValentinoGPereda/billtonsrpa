// src/models/AutenticacionModelo.js
import prisma from '@/lib/prisma.js'

export async function autenticarTrabajador({ usuario, contraseña }) {
  
  const trabajador = await prisma.trabajador.findUnique({
    where: { correo: usuario }
  })
  if (!trabajador) return null

  
  if (trabajador.contrasenia !== contraseña) {
    return null
  }
  return trabajador
}

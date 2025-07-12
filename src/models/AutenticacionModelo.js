// src/models/AutenticacionModelo.js
import prisma from '@/lib/prisma.js'

/**
 * Intenta autenticar un trabajador por correo y contraseña.
 */
export async function autenticarTrabajador({ usuario, contraseña }) {
  // AHORA buscamos por correo, no por apellido
  const trabajador = await prisma.trabajador.findUnique({
    where: { correo: usuario }
  })
  if (!trabajador) return null

  // Aquí compararías el hash; por ahora texto plano
  if (trabajador.contrasenia !== contraseña) {
    return null
  }
  return trabajador
}

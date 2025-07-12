// src/models/UsuarioModelo.js
import prisma from '@/lib/prisma.js'

/**
 * Registra un trabajador usando rol_id
 * @param {{ nombre:string, usuario:string, email:string, contraseña:string, rol:string }} datos
 */
export async function crearTrabajador({ nombre, usuario, email, contraseña, rol }) {
  // Buscamos el role_id
  const rolRegistro = await prisma.role.findUnique({
    where: { nombre: rol }
  })
  if (!rolRegistro) {
    throw new Error(`Rol "${rol}" no encontrado`)
  }

  // Creamos al trabajador
  return prisma.trabajador.create({
    data: {
      nombre,
      apellido: usuario,      // “usuario” en front viene del apellido
      correo: email,
      contrasenia: contraseña,
      rol_id: rolRegistro.id,
      grupo_id: null           // si de momento no asignas grupo
    }
  })
}

/** Lista todos los trabajadores (opcional) */
export function obtenerTrabajadores() {
  return prisma.trabajador.findMany()
}

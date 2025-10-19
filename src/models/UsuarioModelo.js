// src/models/UsuarioModelo.js
import prisma from '@/lib/prisma.js'
 
export async function crearTrabajador({ nombre, usuario, email, contraseña, rol }) {

  const rolRegistro = await prisma.role.findUnique({
    where: { nombre: rol }
  })
  if (!rolRegistro) {
    throw new Error(`Rol "${rol}" no encontrado`)
  }
  return prisma.trabajador.create({
    data: {
      nombre,
      apellido: usuario,      
      correo: email,
      contrasenia: contraseña,
      rol_id: rolRegistro.id,
      grupo_id: null          
    }
  })
}

export function obtenerTrabajadores() {
  return prisma.trabajador.findMany()
}

// src/models/RoleModelo.js
import prisma from '@/lib/prisma.js'

/** Devuelve todos los roles */
export function obtenerRoles() {
  return prisma.role.findMany({
    orderBy: { id: 'asc' }
  })
}

// src/models/ClienteModelo.js
import prisma from '@/lib/prisma.js'

/** Crea un cliente (lanza error si correo duplicado) */
export function crearCliente({ nombre, apellido, correo, celular }) {
  return prisma.cliente.create({
    data: { nombre, apellido, correo, celular }
  })
}

/** Devuelve todos los clientes, ordenados por ID asc */
export function obtenerClientes() {
  return prisma.cliente.findMany({
    orderBy: { id: 'asc' }
  })
}

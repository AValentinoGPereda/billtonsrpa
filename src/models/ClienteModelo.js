// src/models/ClienteModelo.js

// Aquí simulamos una “tabla” en memoria


/**
 * Crea un cliente si no existe duplicado.
 */
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/** Crea un cliente si no existe duplicado. */
export async function crearCliente({ nombre, correo, celular }) {
  // Esto lanzará un error si `correo` es UNIQUE en la DB
  return prisma.cliente.create({
    data: { nombre, correo, celular }
  })
}

/** Devuelve todos los clientes */
export async function obtenerClientes() {
  return prisma.cliente.findMany()
}

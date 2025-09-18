// src/models/InventarioModelo.js

import prisma from '@/lib/prisma.js'


export async function obtenerMateriales(filtro = '') {
  if (!filtro) {
    return prisma.material.findMany({
      orderBy: { id: 'asc' }
    })
  }

  return prisma.material.findMany({
    where: {
      OR: [
        { nombre: { contains: filtro, mode: 'insensitive' } },
        { tipo: { contains: filtro, mode: 'insensitive' } },
        { color: { contains: filtro, mode: 'insensitive' } },
        { ubicacion: { contains: filtro, mode: 'insensitive' } }
      ]
    },
    orderBy: { id: 'asc' }
  })
}

export async function obtenerMaterialPorId(id) {
  return prisma.material.findUnique({
    where: { id: Number(id) }
  })
}

export async function actualizarMaterial({ id, nombre, tipo, cantidad, umbral, color, ubicacion }) {
  const nCantidad = Number(cantidad)
  if (isNaN(nCantidad) || nCantidad < 0) throw new Error('Cantidad inválida')

  return prisma.material.update({
    where: { id: Number(id) },
    data: {
      nombre,
      tipo,
      cantidad: nCantidad,
      umbral: umbral ? Number(umbral) : undefined,
      color,
      ubicacion
    }
  })
}

export async function crearMaterial({ nombre, tipo, cantidad, umbral, color, ubicacion }) {
  const nCantidad = Number(cantidad)
  if (isNaN(nCantidad) || nCantidad < 0) throw new Error('Cantidad inválida')

  return prisma.material.create({
    data: {
      nombre,
      tipo,
      cantidad: nCantidad,
      umbral: umbral ? Number(umbral) : 10,
      color,
      ubicacion
    }
  })
}

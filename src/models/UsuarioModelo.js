// src/models/UsuarioModelo.js

/** 
 * Aquí pondrías tu lógica de base de datos (Prisma, mssql, etc.). 
 * Por ahora simulamos la inserción.
 */
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/** Crea un usuario; lanzará si usuario o email ya existen */
export async function crearUsuario({ nombre, usuario, email, contraseña, rol }) {
  return prisma.usuario.create({
    data: { nombre, usuario, email, contraseña, rol }
  })
}

/** Lista todos los usuarios */
export async function obtenerUsuarios() {
  return prisma.usuario.findMany()
}

/** Busca usuario por nombre de usuario */
export async function buscarPorUsuario(usuarioBuscado) {
  return prisma.usuario.findUnique({
    where: { usuario: usuarioBuscado }
  })
}
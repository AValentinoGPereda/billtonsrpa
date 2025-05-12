// src/models/UsuarioModelo.js

/** 
 * Aquí pondrías tu lógica de base de datos (Prisma, mssql, etc.). 
 * Por ahora simulamos la inserción.
 */
const usuarios = []

export function crearUsuario({ nombre, usuario, email, contraseña, rol }) {
  const nuevo = { id: Date.now(), nombre, usuario, email, contraseña, rol }
  usuarios.push(nuevo)
  return nuevo
}

export function obtenerUsuarios() {
  return usuarios
}

// src/controllers/RoleControlador.js
import { obtenerRoles } from '@/models/RoleModelo.js'

/** Lista roles */
export async function listarRoles() {
  return await obtenerRoles()
}

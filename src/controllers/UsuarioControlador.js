// src/controllers/UsuarioControlador.js
import { crearTrabajador, obtenerTrabajadores } from '@/models/UsuarioModelo.js'

export async function registrarUsuario(datos) {
  // Aquí puedes validar formatos, contraseñas coincidan, etc.
  return await crearTrabajador(datos)
}

export async function listarUsuarios() {
  return await obtenerTrabajadores()
}

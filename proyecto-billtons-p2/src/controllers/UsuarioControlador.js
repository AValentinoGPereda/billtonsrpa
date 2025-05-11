// src/controllers/UsuarioControlador.js
import { crearUsuario, obtenerUsuarios } from '@models/UsuarioModelo'

export function registrarUsuario(datos) {
  // Aquí podrías añadir validaciones adicionales o hashing de contraseña
  return crearUsuario(datos)
}

export function listarUsuarios() {
  return obtenerUsuarios()
}

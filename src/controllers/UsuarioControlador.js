import {
  crearUsuario,
  obtenerUsuarios
} from '@models/UsuarioModelo'

export async function registrarUsuario(datos) {
  return crearUsuario(datos)
}

export async function listarUsuarios() {
  return obtenerUsuarios()
}
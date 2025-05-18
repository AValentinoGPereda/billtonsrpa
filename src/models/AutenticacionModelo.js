import { obtenerUsuarios } from './UsuarioModelo.js'

export function validarCredenciales(usuarioBuscado, contraseñaBuscada) {
  const usuarios = obtenerUsuarios()
  return usuarios.find(
    (u) => u.usuario === usuarioBuscado && u.contraseña === contraseñaBuscada
  ) || null
}
import { buscarPorUsuario } from './UsuarioModelo'

/**
 * Valida credenciales: busca usuario y compara contraseña.
 */
export async function validarCredenciales(usuario, contraseña) {
  const u = await buscarPorUsuario(usuario)
  if (!u || u.contraseña !== contraseña) return null
  return u
}
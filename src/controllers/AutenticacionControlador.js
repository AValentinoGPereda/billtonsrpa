import { validarCredenciales } from '@models/AutenticacionModelo'

export async function iniciarSesion({ usuario, contraseña }) {
  return validarCredenciales(usuario, contraseña)
}
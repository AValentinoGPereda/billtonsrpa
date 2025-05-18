import { validarCredenciales } from '@models/AutenticacionModelo'

export function iniciarSesion({ usuario, contraseña }) {
  return validarCredenciales(usuario, contraseña)
}

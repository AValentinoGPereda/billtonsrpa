// src/controllers/AutenticacionControlador.js
import { autenticarTrabajador } from '@/models/AutenticacionModelo.js'

export async function iniciarSesion(datos) {
  return await autenticarTrabajador(datos)
}

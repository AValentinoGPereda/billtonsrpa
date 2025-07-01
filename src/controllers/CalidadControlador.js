// src/controllers/CalidadControlador.js
import {
  registrarInspeccion,
  obtenerInspecciones
} from '@/models/CalidadModelo'

export function crearInspeccion(datos) {
  return registrarInspeccion(datos)
}

export function listarInspecciones(pedidoId) {
  return obtenerInspecciones(pedidoId)
}

// src/controllers/DevolucionControlador.js
import {
  registrarDevolucion,
  rectificarDevolucion,
  obtenerDevoluciones
} from '@/models/DevolucionModelo'

export function crearDevolucion(datos) {
  return registrarDevolucion(datos)
}

export function actualizarDevolucion(id) {
  return rectificarDevolucion(id)
}

export function listarDevoluciones(pedidoId) {
  return obtenerDevoluciones(pedidoId)
}

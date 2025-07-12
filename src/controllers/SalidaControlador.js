// src/controllers/SalidaControlador.js
import {
  registrarSalida,
  obtenerSalidas,
  obtenerSalidasPorPedido
} from '@/models/SalidaModelo.js'

/** Crea y devuelve la nueva salida */
export function crearSalida(datos) {
  return registrarSalida(datos)
}

/** Lista todas las salidas */
export function listarSalidas() {
  return obtenerSalidas()
}

/** Lista las salidas de un pedido específico */
export function listarSalidasPedido(pedidoId) {
  return obtenerSalidasPorPedido(pedidoId)
}

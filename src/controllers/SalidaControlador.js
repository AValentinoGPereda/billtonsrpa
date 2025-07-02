// src/controllers/SalidaControlador.js

import {
  registrarSalida,
  obtenerSalidas,
  obtenerSalidasPorPedido
} from '@/models/SalidaModelo'

export function crearSalida(datos) {
  return registrarSalida(datos)
}

export function listarSalidas() {
  return obtenerSalidas()
}

export function listarSalidasPedido(pedidoId) {
  return obtenerSalidasPorPedido(pedidoId)
}

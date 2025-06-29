// src/controllers/PedidoControlador.js
import { crearPedido, obtenerPedidos, obtenerPedidoPorId } from '@models/PedidoModelo'

export function registrarPedido(datos) {
  return crearPedido(datos)
}

export function listarPedidos() {
  return obtenerPedidos()
}

export function verPedido(idPed) {
  return obtenerPedidoPorId(idPed)
}

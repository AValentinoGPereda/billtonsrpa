// src/controllers/PedidoControlador.js

import {
  crearPedido,
  obtenerPedidos,
  obtenerPedidoPorId
} from '@models/PedidoModelo'

export function registrarPedido(datos) {
  return crearPedido(datos)
}

export function listarPedidos() {
  return obtenerPedidos()
}

export function verPedido(idPed) {
  return obtenerPedidoPorId(idPed)
}

/** NUEVA: solo los pedidos en estado "Producción" */
export function listarPedidosAsignados() {
  return obtenerPedidos().filter(p => p.estadoPed === 'Producción')
}

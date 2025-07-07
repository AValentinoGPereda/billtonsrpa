// src/controllers/PedidoControlador.js
import {
  crearPedido,
  listarPedidos,
  listarPedidosAsignados,
  verPedido
} from '@/models/PedidoModelo.js'

export async function registrarPedido(datos) {
  return await crearPedido(datos)
}

export async function obtenerTodosPedidos() {
  return await listarPedidos()
}

export async function obtenerPedidosAsignados() {
  return await listarPedidosAsignados()
}

export async function obtenerPedidoDetalle(id) {
  return await verPedido(id)
}

// src/models/SalidaModelo.js

import { actualizarMaterial } from './InventarioModelo'

// Almacenaje en memoria
const salidas = []

/**
 * Crea un registro de salida:
 * - descuenta stock de cada pedido (ejemplo: asumimos pedido.cantidad)
 * @param {{ pedidoId:string, destino:string, responsable:string, cantidad:number }} datos
 */
export function registrarSalida({ pedidoId, destino, responsable, cantidad }) {
  const fecha = new Date().toISOString()
  // Aquí descontarías del inventario (simplificado)
  // actualizarMaterial(...) …

  const salida = {
    id: salidas.length + 1,
    pedidoId,
    fecha,
    destino,
    responsable,
    cantidad
  }
  salidas.push(salida)
  return salida
}

/** Devuelve todas las salidas */
export function obtenerSalidas() {
  return salidas
}

/** Devuelve las salidas de un pedido */
export function obtenerSalidasPorPedido(pedidoId) {
  return salidas.filter(s => s.pedidoId === pedidoId)
}

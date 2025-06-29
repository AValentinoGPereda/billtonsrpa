// src/models/PedidoModelo.js

// Simulamos almacenamiento en memoria
const pedidos = []

/**
 * Crea un pedido y lanza si hay duplicado de id
 */
export function crearPedido({ idCli, prenda, modelo, tallas, cantidad, tipoEntrega, fechaEntrega, detalleCliente, detalleConfeccion }) {
  const nuevo = {
    idPed: `PED${String(pedidos.length + 1).padStart(2, '0')}`,
    idCli,
    prenda,
    modelo,
    tallas,
    cantidad,
    tipoEntrega,
    fechaEntrega,
    detalleCliente,
    detalleConfeccion,
    estadoPed: 'Producción'
  }
  pedidos.unshift(nuevo)  // insert al principio para ver el más reciente arriba
  return nuevo
}

/** Devuelve todos los pedidos */
export function obtenerPedidos() {
  return pedidos
}

/** Devuelve un pedido por su idPed */
export function obtenerPedidoPorId(idPed) {
  return pedidos.find(p => p.idPed === idPed) || null
}

// src/controllers/AsignacionMaterialControlador.js

import {
  listarMaterialesDisponibles,
  asignarMaterialesAPedido,
  obtenerAsignacionesPorPedido
} from '@models/AsignacionMaterialModelo'

export function listarDisponibles() {
  return listarMaterialesDisponibles()
}

export function crearAsignacion(pedidoId, detalles) {
  return asignarMaterialesAPedido(pedidoId, detalles)
}

export function historialAsignaciones(pedidoId) {
  return obtenerAsignacionesPorPedido(pedidoId)
}

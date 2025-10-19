// src/controllers/AsignacionMaterialControlador.js
import {
  listarMaterialesDisponibles,
  asignarMaterialesAPedido,
  obtenerAsignacionesPorPedido
} from '@models/AsignacionMaterialModelo'

export async function listarDisponibles() {
  try {
    return await listarMaterialesDisponibles()
  } catch (error) {
    console.error('Error en listarDisponibles:', error)
    return []
  }
}

export async function crearAsignacion(pedidoId, detalles) {
  if (!detalles || !Array.isArray(detalles)) {
    throw new Error('Detalles de asignación inválidos')
  }
  return await asignarMaterialesAPedido(pedidoId, detalles)
}

export async function historialAsignaciones(pedidoId) {
  try {
    return await obtenerAsignacionesPorPedido(pedidoId)
  } catch (error) {
    console.error('Error en historialAsignaciones:', error)
    return []
  }
}
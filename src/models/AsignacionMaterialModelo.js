// src/models/AsignacionMaterialModelo.js

import { obtenerMateriales, actualizarMaterial } from './InventarioModelo'

// Historial de asignaciones en memoria
const asignaciones = []

/**
 * Lista de materiales disponibles con stock.
 */
export function listarMaterialesDisponibles() {
  return obtenerMateriales()
}

/**
 * Asigna una lista de { codigo, cantidadAsignada } a un pedido.
 * - Verifica stock suficiente.
 * - Descuenta del inventario.
 * - Crea un registro en asignaciones.
 */
export function asignarMaterialesAPedido(pedidoId, listaAsignaciones) {
  const fecha = new Date().toISOString()
  const registro = { pedidoId, fecha, detalles: [] }

  listaAsignaciones.forEach(({ codigo, cantidad }) => {
    const cant = Number(cantidad)
    if (isNaN(cant) || cant <= 0) {
      throw new Error(`Cantidad inválida para ${codigo}`)
    }
    // Obtener material
    const material = obtenerMateriales().find(m => m.codigo === codigo)
    if (!material) {
      throw new Error(`Material ${codigo} no encontrado`)
    }
    if (material.stock < cant) {
      throw new Error(`Stock insuficiente para ${codigo}`)
    }
    // Descontar stock
    actualizarMaterial({
      codigo,
      nombre: material.nombre,
      stock: material.stock - cant,
      ubicacion: material.ubicacion
    })
    // Añadir al registro
    registro.detalles.push({ codigo, cantidad: cant })
  })

  asignaciones.push(registro)
  return registro
}

/**
 * Historial de asignaciones por pedido.
 */
export function obtenerAsignacionesPorPedido(pedidoId) {
  return asignaciones.filter(a => a.pedidoId === pedidoId)
}

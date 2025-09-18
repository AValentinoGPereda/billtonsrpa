// src/controllers/InventarioControlador.js
import {
  obtenerMateriales,
  obtenerMaterialPorId,
  actualizarMaterial,
  crearMaterial
} from '@models/InventarioModelo'

export function listarInventario(filtro) {
  return obtenerMateriales(filtro)
}

export function verMaterial(id) {
  return obtenerMaterialPorId(id)
}

export function editarMaterial(datos) {
  return actualizarMaterial(datos)
}

export function registrarMaterial(datos) {
  return crearMaterial(datos)
}

// src/controllers/InventarioControlador.js
import {
  obtenerMateriales,
  obtenerMaterialPorCodigo,
  actualizarMaterial
} from '@models/InventarioModelo'

export function listarInventario(filtro) {
  return obtenerMateriales(filtro)
}

export function verMaterial(codigo) {
  return obtenerMaterialPorCodigo(codigo)
}

export function editarMaterial(datos) {
  return actualizarMaterial(datos)
}

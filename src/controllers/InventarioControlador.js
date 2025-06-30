// src/controllers/InventarioControlador.js
import { obtenerMateriales } from '@models/InventarioModelo'

/** Listar inventario, con búsqueda opcional */
export function listarInventario(filtro) {
  return obtenerMateriales(filtro)
}

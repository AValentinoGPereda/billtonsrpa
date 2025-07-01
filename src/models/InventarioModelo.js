// src/models/InventarioModelo.js

const materiales = [
  { codigo:'FT01', nombre:'Far. Tela Negro', stock:20, ubicacion:'Area T' },
  { codigo:'FT02', nombre:'Far. Tela Marino', stock:10, ubicacion:'Area T' },
  { codigo:'FT03', nombre:'Far. Tela Vino', stock:5, ubicacion:'Area T' },
  // …
]

export function obtenerMateriales(filtro = '') {
  if (!filtro) return materiales
  const q = filtro.toLowerCase()
  return materiales.filter(m =>
    m.codigo.toLowerCase().includes(q) ||
    m.nombre.toLowerCase().includes(q)
  )
}

export function obtenerMaterialPorCodigo(codigo) {
  return materiales.find(m => m.codigo === codigo) || null
}

export function actualizarMaterial({ codigo, nombre, stock, ubicacion }) {
  const idx = materiales.findIndex(m => m.codigo === codigo)
  if (idx === -1) throw new Error('Material no encontrado')
  const nStock = Number(stock)
  if (isNaN(nStock) || nStock < 0) throw new Error('Stock inválido')
  materiales[idx] = { codigo, nombre, stock: nStock, ubicacion }
  return materiales[idx]
}

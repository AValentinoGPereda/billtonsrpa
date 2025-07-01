// src/models/CalidadModelo.js
const inspecciones = []

export function registrarInspeccion({ pedidoId, totalEsperado, aprobadas, rectificadas }) {
  const tot = Number(totalEsperado)
  const apr = Number(aprobadas)
  const rec = Number(rectificadas)
  if ([tot, apr, rec].some(v => isNaN(v) || v < 0 || !Number.isInteger(v))) {
    throw new Error('Todos los valores deben ser enteros ≥ 0')
  }
  const rechazadas = tot - apr
  if (rechazadas < 0) throw new Error('Aprobadas no pueden exceder el total esperado')
  const estado = rec < rechazadas ? 'EVALUACIÓN' : 'FINALIZADO'
  const inspeccion = {
    id: inspecciones.length + 1,
    pedidoId,
    fecha: new Date().toISOString(),
    totalEsperado: tot,
    aprobadas: apr,
    rechazadas,
    rectificadas: rec,
    estado
  }
  inspecciones.push(inspeccion)
  return inspeccion
}

export function obtenerInspecciones(pedidoId) {
  return inspecciones.filter(i => i.pedidoId === pedidoId)
}

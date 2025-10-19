// src/controllers/DevolucionControlador.js
import {
  registrarDevolucion,
  rectificarDevolucion,
  obtenerDevoluciones
} from '@/models/DevolucionModelo'

export async function crearDevolucion(datos) {
  // Validar campos obligatorios según schema Prisma
  const camposRequeridos = ['pedidoId', 'clienteId', 'modelo', 'defecto', 'cantidad', 'accion']
  const faltantes = camposRequeridos.filter(campo => !datos[campo])
  
  if (faltantes.length > 0) {
    throw new Error(`Faltan campos obligatorios: ${faltantes.join(', ')}`)
  }
  
  // Validar que la acción sea válida (según criterios de aceptación)
  const accionesPermitidas = ['reparación', 'retrabajo', 'descarte']
  if (!accionesPermitidas.includes(datos.accion)) {
    throw new Error(`Acción no válida. Debe ser: ${accionesPermitidas.join(', ')}`)
  }

  // Validar tipos de datos
  if (isNaN(Number(datos.cantidad)) || Number(datos.cantidad) <= 0) {
    throw new Error('La cantidad debe ser un número positivo')
  }

  if (isNaN(Number(datos.clienteId))) {
    throw new Error('ID de cliente inválido')
  }

  return await registrarDevolucion(datos)
}

export async function actualizarDevolucion(id) {
  if (!id || isNaN(Number(id))) {
    throw new Error('ID de devolución inválido')
  }
  return await rectificarDevolucion(id)
}

export async function listarDevoluciones(pedidoId) {
  if (!pedidoId || isNaN(Number(pedidoId))) {
    throw new Error('ID de pedido inválido')
  }
  return await obtenerDevoluciones(pedidoId)
}
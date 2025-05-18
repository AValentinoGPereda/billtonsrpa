// src/controllers/ClienteControlador.js
import { crearCliente, obtenerClientes } from '@models/ClienteModelo'

/** Envuelve el modelo para manejar errores */
export function registrarCliente(datos) {
  return crearCliente(datos)
}

export function listarClientes() {
  return obtenerClientes()
}

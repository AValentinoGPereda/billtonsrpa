// src/controllers/ClienteControlador.js
import { crearCliente, obtenerClientes } from '@models/ClienteModelo'

export async function registrarCliente(datos) {
  return crearCliente(datos)
}

export async function listarClientes() {
  return obtenerClientes()
}
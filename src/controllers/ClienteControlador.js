// src/controllers/ClienteControlador.js
import { crearCliente, obtenerClientes } from '@/models/ClienteModelo.js'

export async function registrarCliente(datos) {
  return await crearCliente(datos)
}

export async function listarClientes() {
  return await obtenerClientes()
}

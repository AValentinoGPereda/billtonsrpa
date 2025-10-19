// src/controllers/ClienteControlador.js

import { 
  crearCliente, 
  obtenerClientes, 
  actualizarCliente, 
  eliminarCliente 
} from '@/models/ClienteModelo.js'

export async function registrarCliente(datos) {
  return await crearCliente(datos)
}

export async function listarClientes() {
  return await obtenerClientes()
}

export async function modificarCliente(id, datos) {
  return await actualizarCliente(id, datos)
}

export async function borrarCliente(id) {
  return await eliminarCliente(id)
}

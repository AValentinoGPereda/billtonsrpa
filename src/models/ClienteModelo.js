// src/models/ClienteModelo.js

// Aquí simulamos una “tabla” en memoria
const clientes = []

/**
 * Crea un cliente si no existe duplicado.
 */
export function crearCliente({ nombre, correo, celular }) {
  // Duplicado por correo o celular
  if (clientes.some(c => c.correo === correo || c.celular === celular)) {
    throw new Error('El cliente ya está registrado')
  }
  const nuevo = {
    id: `CL${String(clientes.length + 1).padStart(3, '0')}`,
    nombre,
    correo,
    celular
  }
  clientes.push(nuevo)
  return nuevo
}

/** Devuelve todos los clientes */
export function obtenerClientes() {
  return clientes
}

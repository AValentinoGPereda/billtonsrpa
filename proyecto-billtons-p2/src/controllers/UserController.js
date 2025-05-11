// src/controllers/UserController.js
import { fetchAllUsers } from '@models/UserModel'

export function getAllUsers() {
  // Podrías añadir aquí lógica de negocio
  return fetchAllUsers()
}

// src/controllers/RpaInventarioControlador.js
import { ejecutarRpa, logs } from '../models/RpaInventarioModelo'

export async function runJobRpa() {
  return ejecutarRpa()
}

export function listarLogs() {
  return logs
}

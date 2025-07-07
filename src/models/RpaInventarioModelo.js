// src/models/RpaInventarioModelo.js
import fs from 'fs'
import path from 'path'
import xlsx from 'xlsx'
import { Client } from 'pg'
import nodemailer from 'nodemailer'

// Historial de logs en memoria
export const logs = []

// Umbral por material (podría cargarse de configuración)
const UMBRAL_DEFAULT = 10

// Lee inventario de Excel (simulado)
function leerExcelInventario() {
  const archivo = path.join(process.cwd(), 'inventario.xlsx')
  if (!fs.existsSync(archivo)) throw new Error('Archivo Excel no encontrado')
  const wb = xlsx.readFile(archivo)
  const ws = wb.Sheets[wb.SheetNames[0]]
  return xlsx.utils.sheet_to_json(ws) // [{codigo, stock}, …]
}

// Conexión a Azure SQL (Postgres)
function crearClientePG() {
  return new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  })
}

// Envía correo (simulado)
async function enviarAlerta(materialesBajos) {
  const transporter = nodemailer.createTransport({
    // configuración real aquí
    host: 'smtp.example.com',
    port: 587,
    auth: { user: 'rpa@empresa.com', pass: 'secret' }
  })
  await transporter.sendMail({
    from: '"RPA Inventario" <rpa@empresa.com>',
    to: 'compras@empresa.com',
    subject: 'Alerta bajo stock',
    text: `Materiales en bajo stock:\n${materialesBajos.map(m=>`${m.codigo}: ${m.stock}`).join('\n')}`
  })
}

export async function ejecutarRpa() {
  const inicio = new Date()
  const excel = leerExcelInventario()                     // 1) Leer Excel
  const pg = crearClientePG()
  await pg.connect()
  const materialesBajos = []

  for (const fila of excel) {
    const { codigo, stock } = fila
    // 2) Actualizar en base de datos
    await pg.query('UPDATE inventario SET stock = $1 WHERE codigo = $2', [stock, codigo])
    // 3) Chequear umbral
    if (stock < (fila.umbral || UMBRAL_DEFAULT)) {
      materialesBajos.push({ codigo, stock })
    }
  }

  // 4) Si hay bajos, enviar alerta
  if (materialesBajos.length) {
    await enviarAlerta(materialesBajos)
    logs.push({
      id: logs.length + 1,
      fecha: new Date().toISOString(),
      accion: 'ALERTA',
      detalles: materialesBajos
    })
  }

  // 5) Log de ejecución completa
  logs.push({
    id: logs.length + 1,
    fecha: inicio.toISOString(),
    accion: 'ACTUALIZACIÓN',
    detalles: excel
  })

  await pg.end()
  return { actualizado: excel.length, bajos: materialesBajos.length }
}

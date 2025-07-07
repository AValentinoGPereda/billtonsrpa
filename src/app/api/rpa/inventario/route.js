// src/app/api/rpa/inventario/route.js
import { NextResponse } from 'next/server'
import { runJobRpa, listarLogs } from '@/controllers/RpaInventarioControlador'

export async function POST() {
  try {
    const resultado = await runJobRpa()
    return NextResponse.json({ mensaje: 'Job ejecutado', resultado })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  const historial = listarLogs()
  return NextResponse.json(historial)
}

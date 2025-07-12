// src/app/api/roles/route.js
import { NextResponse } from 'next/server'
import { listarRoles } from '@/controllers/RoleControlador.js'

export async function GET() {
  try {
    const roles = await listarRoles()
    return NextResponse.json(roles)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

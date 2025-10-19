// src/app/api/trabajadores/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const trabajadores = await prisma.trabajador.findMany({
      where: {
        rol_id: {
          not: 1 // Excluir rol 1
        }
      },
      include: {
        roles: {
          select: {
            id: true,
            nombre: true
          }
        }
      },
      orderBy: [
        { nombre: 'asc' },
        { apellido: 'asc' }
      ]
    })
    
    return NextResponse.json(trabajadores)
  } catch (error) {
    console.error('[GET trabajadores]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
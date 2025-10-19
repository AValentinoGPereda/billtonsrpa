// src/models/AsignacionMaterialModelo.js
import prisma from '@/lib/prisma'

/**
 * Lista de materiales disponibles con stock > 0
 */
export async function listarMaterialesDisponibles() {
  try {
    console.log('🔍 Buscando materiales en la base de datos...')
    
    const materiales = await prisma.material.findMany({
      where: {
        cantidad: {
          gt: 0 // Solo materiales con stock > 0
        }
      },
      orderBy: {
        id: 'asc'
      }
    })
    
    console.log(`📦 Encontrados ${materiales.length} materiales:`, materiales)
    
    // Mapear a la estructura esperada por el frontend
    return materiales.map(material => ({
      id: material.id, // Usar 'id' como identificador principal
      codigo: material.id, // Para compatibilidad
      nombre: material.nombre,
      tipo: material.tipo,
      cantidad: material.cantidad, // stock actual
      stock: material.cantidad, // alias para el frontend
      umbral: material.umbral,
      color: material.color,
      ubicacion: material.ubicacion
    }))
    
  } catch (error) {
    console.error('❌ Error en listarMaterialesDisponibles:', error)
    return []
  }
}

/**
 * Asigna materiales a un pedido
 */
export async function asignarMaterialesAPedido(pedidoId, listaAsignaciones) {
  try {
    console.log(`🎯 Asignando materiales al pedido ${pedidoId}:`, listaAsignaciones)

    // Verificar que el pedido existe
    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(pedidoId) }
    })

    if (!pedido) {
      throw new Error(`Pedido ${pedidoId} no encontrado`)
    }

    const resultados = await prisma.$transaction(async (prisma) => {
      const asignacionesCreadas = []

      for (const { codigo, cantidad } of listaAsignaciones) {
        const materialId = Number(codigo)
        const cant = Number(cantidad)
        
        if (isNaN(cant) || cant <= 0) {
          throw new Error(`Cantidad inválida para el material ${materialId}`)
        }

        // Obtener material
        const material = await prisma.material.findUnique({
          where: { id: materialId }
        })

        if (!material) {
          throw new Error(`Material con id ${materialId} no encontrado`)
        }

        if (material.cantidad < cant) {
          throw new Error(`Stock insuficiente para ${material.nombre}. Disponible: ${material.cantidad}, Solicitado: ${cant}`)
        }

        // Descontar stock del material
        await prisma.material.update({
          where: { id: materialId },
          data: {
            cantidad: material.cantidad - cant
          }
        })

        // Crear registro de asignación
        const asignacion = await prisma.asignacionMaterialPedido.create({
          data: {
            pedidoId: Number(pedidoId),
            materialId: materialId,
            cantidadAsignada: cant,
            entregadoAlGrupo: false
          },
          include: {
            material: {
              select: {
                id: true,
                nombre: true,
                tipo: true
              }
            }
          }
        })

        asignacionesCreadas.push(asignacion)
      }

      return asignacionesCreadas
    })

    console.log('✅ Asignaciones creadas:', resultados)
    
    // Formatear respuesta para el frontend
    return {
      pedidoId: Number(pedidoId),
      fecha: new Date().toISOString(),
      detalles: resultados.map(a => ({
        codigo: a.materialId,
        materialId: a.materialId,
        cantidad: a.cantidadAsignada,
        nombreMaterial: a.material.nombre
      }))
    }

  } catch (error) {
    console.error('❌ Error en asignarMaterialesAPedido:', error)
    throw error
  }
}

/**
 * Historial de asignaciones por pedido
 */
export async function obtenerAsignacionesPorPedido(pedidoId) {
  try {
    console.log(`📋 Buscando historial para pedido ${pedidoId}`)
    
    const asignaciones = await prisma.asignacionMaterialPedido.findMany({
      where: {
        pedidoId: Number(pedidoId)
      },
      include: {
        material: {
          select: {
            id: true,
            nombre: true,
            tipo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📜 Encontradas ${asignaciones.length} asignaciones para pedido ${pedidoId}`)

    // Agrupar por fecha de creación (mismo día)
    const agrupadoPorFecha = {}
    
    asignaciones.forEach(asignacion => {
      const fechaKey = asignacion.createdAt.toISOString().split('T')[0] // Fecha sin hora
      
      if (!agrupadoPorFecha[fechaKey]) {
        agrupadoPorFecha[fechaKey] = {
          pedidoId: asignacion.pedidoId,
          fecha: asignacion.createdAt,
          detalles: []
        }
      }
      
      agrupadoPorFecha[fechaKey].detalles.push({
        codigo: asignacion.materialId,
        materialId: asignacion.materialId,
        cantidad: asignacion.cantidadAsignada,
        nombreMaterial: asignacion.material.nombre
      })
    })

    return Object.values(agrupadoPorFecha)

  } catch (error) {
    console.error('❌ Error en obtenerAsignacionesPorPedido:', error)
    return []
  }
}
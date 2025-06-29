// src/app/api/pedidos/registro/route.js
import { NextResponse } from 'next/server'
import { registrarPedido } from '@controllers/PedidoControlador'

export async function POST(request) {
  const datos = await request.json()
  const required = ['idCli','prenda','modelo','tallas','cantidad','tipoEntrega','fechaEntrega']
  for (const campo of required) {
    if (!datos[campo]) {
      return NextResponse.json({ error: `Falta el campo ${campo}` }, { status: 400 })
    }
  }
  try {
    const nuevo = registrarPedido(datos)
    return NextResponse.json({ mensaje: 'Pedido registrado', pedido: nuevo }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

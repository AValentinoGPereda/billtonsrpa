'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistroPedidoPage() {
  const [form, setForm] = useState({
    idCli:'', prenda:'', modelo:'', tallas:'', cantidad:'', tipoEntrega:'Tienda', fechaEntrega:'', detalleCliente:'', detalleConfeccion:''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(''); setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('/api/pedidos/registro', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) setError(data.error)
    else {
      setSuccess(true)
      setForm({ idCli:'', prenda:'', modelo:'', tallas:'', cantidad:'', tipoEntrega:'Tienda', fechaEntrega:'', detalleCliente:'', detalleConfeccion:'' })
      setTimeout(()=>router.push('/pedidos/lista'),1000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
        <h2 className="text-2xl font-semibold mb-2 text-center">Registrar Pedido</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className="text-red-500">{error}</p>}
          {success && <div className="absolute top-2 right-2 bg-green-50 p-3 rounded shadow">✔️ Pedido Registrado</div>}

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span>Número de Pedido</span>
              <input value={`PED--`} disabled className="bg-gray-100 px-2 py-1 rounded"/>
            </label>
            <label className="flex flex-col">
              <span>id_Cli.</span>
              <input name="idCli" value={form.idCli} onChange={handleChange} className="border px-2 py-1 rounded"/>
            </label>
          </div>

          <label className="flex flex-col">
            <span>Prenda</span>
            <input name="prenda" value={form.prenda} onChange={handleChange} className="border px-2 py-1 rounded"/>
          </label>

          <label className="flex flex-col">
            <span>Modelo</span>
            <input name="modelo" value={form.modelo} onChange={handleChange} className="border px-2 py-1 rounded"/>
          </label>

          <label className="flex flex-col">
            <span>Tallas</span>
            <input name="tallas" value={form.tallas} onChange={handleChange} className="border px-2 py-1 rounded"/>
          </label>

          <label className="flex flex-col">
            <span>Cantidad</span>
            <input name="cantidad" type="number" value={form.cantidad} onChange={handleChange} className="border px-2 py-1 rounded"/>
          </label>

          <label className="flex flex-col">
            <span>Tipo de entrega</span>
            <select name="tipoEntrega" value={form.tipoEntrega} onChange={handleChange} className="border px-2 py-1 rounded">
              <option>Tienda</option><option>Domicilio</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span>Fecha entrega</span>
            <input name="fechaEntrega" type="date" value={form.fechaEntrega} onChange={handleChange} className="border px-2 py-1 rounded"/>
          </label>

          <label className="flex flex-col">
            <span>Detall. del Cliente</span>
            <textarea name="detalleCliente" value={form.detalleCliente} onChange={handleChange} className="border px-2 py-1 rounded"/>
          </label>

          <label className="flex flex-col">
            <span>Detall. de confección</span>
            <textarea name="detalleConfeccion" value={form.detalleConfeccion} onChange={handleChange} className="border px-2 py-1 rounded"/>
          </label>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Registrar Pedido</button>
        </form>
      </div>
    </div>
  )
}

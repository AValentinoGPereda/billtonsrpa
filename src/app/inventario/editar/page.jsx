// src/app/inventario/editar/page.jsx
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function EditarInventarioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    tipo: '',
    cantidad: '',
    umbral: '',
    color: '',
    ubicacion: ''
  });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!id) {
      setMensaje('ID no proporcionado');
      return;
    }
    
    // Hacer la solicitud con el parámetro id
    fetch(`/api/inventario?id=${id}`)
      .then(r => {
        if (!r.ok) {
          throw new Error('Error al obtener el material');
        }
        return r.json();
      })
      .then(material => {
        if (!material) {
          setMensaje('Material no encontrado');
        } else {
          setForm({
            id: material.id,
            nombre: material.nombre,
            tipo: material.tipo,
            cantidad: material.cantidad.toString(),
            umbral: material.umbral.toString(),
            color: material.color || '',
            ubicacion: material.ubicacion || ''
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setMensaje('Error al cargar el material');
      });
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMensaje('');
  }

  async function guardar() {
    try {
      const res = await fetch('/api/inventario', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          cantidad: parseInt(form.cantidad),
          umbral: parseInt(form.umbral)
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        setMensaje(data.error);
      } else {
        setMensaje('✔️ Actualización exitosa');
      }
    } catch (e) {
      setMensaje('Error de conexión');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-blue-900">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-900">Editar Material</h2>
        {mensaje && <p className="text-sm text-red-500 mb-2 text-blue-900">{mensaje}</p>}

        <div className="space-y-3">
          <div>
            <label className="block">ID</label>
            <input
              name="id"
              value={form.id}
              disabled
              className="w-full border bg-gray-100 px-2 py-1 rounded text-blue-900"
            />
          </div>
          <div>
            <label className="block">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded text-blue-900"
            />
          </div>
          <div>
            <label className="block">Tipo</label>
            <input
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded text-blue-900"
            />
          </div>
          <div>
            <label className="block">Cantidad</label>
            <input
              name="cantidad"
              type="number"
              value={form.cantidad}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded text-blue-900"
            />
          </div>
          <div>
            <label className="block">Umbral</label>
            <input
              name="umbral"
              type="number"
              value={form.umbral}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded text-blue-900"
            />
          </div>
          <div>
            <label className="block">Color</label>
            <input
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded text-blue-900"
            />
          </div>
          <div>
            <label className="block">Ubicación</label>
            <input
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded text-blue-900"
            />
          </div>
          <button
            onClick={guardar}
            className="w-full bg-blue-600 text-white py-2 rounded mt-2"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditarInventarioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    }>
      <EditarInventarioContent />
    </Suspense>
  );
}
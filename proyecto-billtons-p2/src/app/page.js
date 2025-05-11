'use client'

import { useEffect, useState } from 'react'

export default function HomePage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Lista de Usuarios</h1>
      {users.length === 0 ? (
        <p>Cargando usuarios…</p>
      ) : (
        <ul className="list-disc pl-5">
          {users.map((u) => (
            <li key={u.id}>{u.name}</li>
          ))}
        </ul>
      )}
    </main>
  )
}

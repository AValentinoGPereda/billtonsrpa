// src/app/layout.js
import './globals.css'
import BarraLateral from '@/components/BarraLateral'

export const metadata = {
  title: 'Billtons',
  description: 'Control de Usuarios',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="flex bg-gray-100">
        <BarraLateral />
        <main className="flex-1 p-6">
          {children}
        </main>
      </body>
    </html>
  )
}

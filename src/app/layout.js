// src/app/layout.js
import './globals.css'

export const metadata = {
  title: 'Billtons',
  description: 'Control de Usuarios',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      {/* Aquí definimos el color de fondo de toda la app */}
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  )
}

// src/models/UserModel.js

/**
 * Simula acceso a base de datos para obtener usuarios.
 * En tu caso aquí iría Prisma, mssql, etc.
 */
export function fetchAllUsers() {
    return [
      { id: 1, name: 'Ana Pérez' },
      { id: 2, name: 'Luis García' }
    ];
  }
  
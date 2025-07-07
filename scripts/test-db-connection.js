// scripts/test-db-connection.js

console.log('→ Iniciando prueba de conexión…');

require('dotenv').config();
const { Client } = require('pg');

const url = process.env.DATABASE_URL;
console.log('DATABASE_URL detectado:', url ? '✓ encontrado' : '✗ NO definido');

async function test() {
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('→ Cliente conectado, ejecutando SELECT NOW()…');
    const res = await client.query('SELECT NOW()');
    console.log('🗸 Conexión exitosa, hora del servidor:', res.rows[0].now);
  } catch (err) {
    console.error('✗ Error al conectar o ejecutar consulta:', err.message);
  } finally {
    await client.end();
    console.log('→ Conexión cerrada.');
  }
}

test();

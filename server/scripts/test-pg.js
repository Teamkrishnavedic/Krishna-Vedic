const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Client } = require('pg');

async function testPg() {
  const connectionString = process.env.DATABASE_URL;
  console.log('Connecting with pg Client...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Successfully connected to Postgres via pg!');
    const res = await client.query('SELECT count(*) FROM "Product";');
    console.log('Product count:', res.rows[0].count);
    const catRes = await client.query('SELECT id, name, slug FROM "Category";');
    console.log('Categories:', catRes.rows);
  } catch (err) {
    console.error('pg client error:', err);
  } finally {
    await client.end();
  }
}

testPg();


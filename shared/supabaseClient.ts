import { Pool, QueryResult } from "pg";

console.log("Connection String:", process.env.CONNECTION_STRING);

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  max: 20, // Jumlah maksimal koneksi dalam pool
  idleTimeoutMillis: 30000, // Berapa lama koneksi dibiarkan idle sebelum diputus
  connectionTimeoutMillis: 2000, // Berapa lama menunggu sebelum gagal koneksi
});

// Cara pakai di dalam service/function
export const query = (text: string, params?: any[]): Promise<QueryResult> => {
  return pool.query(text, params);
};

// Kamu tidak perlu memanggil .connect() setiap kali ingin query.
// Pool akan menanganinya untukmu.

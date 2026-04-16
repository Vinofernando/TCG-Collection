import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Inisialisasi Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = path.join(__dirname, "data", "english"); // Sesuaikan dengan folder Anda

async function uploadAllCards() {
  console.log("🚀 Memulai proses upload kartu...");

  // 1. Baca semua file di folder english
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((file) => file.startsWith("cards_") && file.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const rawData = fs.readFileSync(filePath, "utf-8");
    const cards = JSON.parse(rawData);

    console.log(`📦 Memproses ${file} (${cards.length} kartu)...`);

    // 2. Mapping data JSON Vegapull ke kolom Tabel Supabase kita
    const formattedCards = cards.map((card: any) => ({
      id: card.id,
      pack_id: card.pack_id,
      name: card.name,
      rarity: card.rarity,
      category: card.category,
      img_full_url: card.img_full_url,
      colors: card.colors,
      cost: card.cost || 0,
      attributes: card.attributes,
      power: card.power || 0,
      counter: card.counter || 0,
      types: card.types,
      effect: card.effect,
      trigger: card.trigger,
    }));

    // 3. Upsert ke Supabase (Insert jika baru, Update jika ID sudah ada)
    const { error } = await supabase
      .from("cards")
      .upsert(formattedCards, { onConflict: "id" });

    if (error) {
      console.error(`❌ Gagal upload ${file}:`, error.message);
    } else {
      console.log(`✅ Berhasil upload ${file}`);
    }
  }

  console.log("🏁 Semua data kartu telah berhasil disinkronisasi!");
}

uploadAllCards();

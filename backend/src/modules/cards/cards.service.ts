import { Cards, SingleCard } from "../../../../shared/index.js";
import { query } from "../../../../shared/supabaseClient.js";

export const getAllCards = async (queryURL?: {
  id?: string;
  packId?: string;
  page?: number;
  limit?: number;
  cardName?: string;
  category?: string | string[];
  color?: string | string[];
}): Promise<Cards[]> => {
  const {
    id,
    packId,
    page = 1,
    limit = 20,
    cardName,
    category,
    color,
  } = queryURL || {};
  const offset = (page - 1) * limit;
  let queryText = "SELECT * FROM cards";
  const conditions = [];
  const values: any[] = [];

  if (id) {
    values.push(`%${id}%`);
    conditions.push(` id ILIKE $${values.length}`);
  }
  if (packId) {
    values.push(packId);
    conditions.push(` pack_id = $${values.length}`);
  }

  if (cardName) {
    values.push(`%${cardName}%`);
    conditions.push(` name ILIKE $${values.length} `);
  }

  if (category) {
    // Pastikan category selalu dalam bentuk Array,
    // karena query string kadang mengirim string tunggal jika cuma 1 yang dipilih
    const categoryArray = Array.isArray(category) ? category : [category];

    if (categoryArray.length > 0) {
      // Membuat placeholders seperti $4, $5, $6 tergantung jumlah kategori
      const placeholders = categoryArray
        .map((_, i) => {
          values.push(categoryArray[i].toLowerCase());
          return `$${values.length}`;
        })
        .join(", ");

      conditions.push(` LOWER(category) IN (${placeholders})`);
    }
  }

  if (color) {
    const colorArray = Array.isArray(color)
      ? color
      : color
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);

    if (colorArray.length > 0) {
      values.push(colorArray);
      conditions.push(` colors && $${values.length}`); // AND
    }
  }

  if (conditions.length > 0) {
    queryText += " WHERE " + conditions.join(" AND ");
  } else if (conditions.length === 1) {
    queryText += " WHERE " + conditions;
  }

  values.push(limit, offset);
  queryText += ` ORDER BY id ASC LIMIT $${values.length - 1} OFFSET $${values.length}`;
  console.log(queryText);
  const result = await query(queryText, values);
  return result.rows;
};

export const getSingleCard = async (queryURL?: {
  imgUrl?: string;
}): Promise<SingleCard[]> => {
  const { imgUrl } = queryURL || {};

  const result = await query(
    `SELECT id, name, rarity, category, img_full_url, cost, attributes, power, counter, types, effect, trigger FROM cards WHERE img_full_url = $1`,
    [imgUrl],
  );

  return result.rows;
};

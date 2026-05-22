import { query } from "../../../../shared/supabaseClient.js";

interface CollectionResponse {
  data: any[];
  total: number;
  currentPage: number;
}

export const getUserCollection = async (
  userId?: number,
  page = 1,
): Promise<CollectionResponse> => {
  const offset = (page - 1) * 10;
  const result = await query(
    `
        SELECT 
            u.user_name,
            uc.card_id,
            c.pack_id,
            c.name,
            c.rarity,
            c.category,
            c.img_full_url,
            c.colors,
            c.cost,
            c.attributes,
            c.power,
            c.counter,
            c.types,
            c.effect,
            c.trigger
        FROM users u
        LEFT JOIN user_collection uc on u.user_id = uc.user_id
        LEFT JOIN cards c on uc.card_id = c.id
        WHERE uc.user_id = $1
        LIMIT $2 OFFSET $3
        `,
    [userId, page, offset],
  );

  return {
    data: result.rows,
    total: result.rows.length,
    currentPage: page,
  };
};

// =========================================================
//  Product model  —  the ONLY place product SQL lives.
//  - Real, final queries. ? placeholders only.
//  - Soft-delete aware: reads filter is_deleted = 0.
//  - Paginated getList per project decision.
// =========================================================

import { dbQuery } from "../config/db.js";

export async function listProducts(page: number = 1, limit: number = 10): Promise<any[]> {
  const offset = (page - 1) * limit;
  return await dbQuery(
    "SELECT id, name, description, price, stock, category, image_url, created_at, updated_at " +
    "FROM products WHERE is_deleted = 0 " +
    "ORDER BY id DESC LIMIT ? OFFSET ?",
    [limit, offset]
  );
}

export async function countProducts(): Promise<number> {
  const rows = await dbQuery(
    "SELECT COUNT(*) AS totel FROM products WHERE is_deleted = 0"
  );
  return rows[0].totel;
}

export async function findProductById(id: number): Promise<any | null> {
  const rows = await dbQuery(
    "SELECT id, name, description, price, stock, category, image_url, created_at, updated_at " +
    "FROM products WHERE id = ? AND is_deleted = 0 LIMIT 1",
    [id]
  );
  return rows.length ? rows[0] : null;
}

export async function createProduct(
  name: string,
  description: string,
  price: number,
  stock: number,
  category: string,
  imageUrl: string
): Promise<number> {
  await dbQuery(
    "INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description, price, stock, category, imageUrl]
  );
  const rows = await dbQuery("SELECT LAST_INSERT_ID() AS id");
  return rows[0].id;
}

export async function updateProduct(
  id: number,
  name: string,
  description: string,
  price: number,
  stock: number,
  category: string,
  imageUrl: string
): Promise<boolean> {
  await dbQuery(
    "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ? " +
    "WHERE id = ? AND is_deleted = 0",
    [name, description, price, stock, category, imageUrl, id]
  );
  const rows = await dbQuery(
    "SELECT id FROM products WHERE id = ? AND is_deleted = 0 LIMIT 1",
    [id]
  );
  return rows.length > 0;
}

export async function softDeleteProduct(id: number): Promise<boolean> {
  const existing = await findProductById(id);
  if (!existing) return false;

  await dbQuery("UPDATE products SET is_deleted = 1 WHERE id = ?", [id]);
  return true;
}
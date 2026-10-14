// =========================================================
//  Product controllers  —  CRUD
//  - Reads req.user  (attached by the auth middleware)
//  - Validation with zod before any DB call
//  - Returns the standard { success, message, data } shape
// =========================================================

import { z } from "zod";
import { ok, fail } from "../utils/responds.js";
import {
  listProducts,
  countProducts,
  findProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
} from "../models/products.js";

// ---------------------------------------------------------
//  Validation schemas  —  the gate before logic runs.
// ---------------------------------------------------------
const ProductSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().optional().default(""),
  price: z.number().min(0),
  stock: z.number().min(0),
  category: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
});

// =========================================================
//  1. LIST  —  GET /api/product
//     Any logged-in user.  Paginated.
// =========================================================
export async function list(req: any, res: any) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  try{
     const products = await listProducts(page, limit);
     const total = await countProducts();

  return res.json(
    ok({ products, page, limit, total }, "Products fetched")
  );
  }
  catch (error) {
  console.error('List products:', error);
  return res.status(500).json({
    success: false,
    message: 'Product fetch failed',
    error: error instanceof Error ? error.message : String(error),
  });
}


}

// =========================================================
//  2. GET ONE  —  GET /api/product/:id
// =========================================================
export async function getOne(req: any, res: any) {
  const id = Number(req.params.id);
  try{
      if (!id) return res.status(400).json(fail("Invalid product id"));

  const product = await findProductById(id);
  if (!product) return res.status(404).json(fail("Product not found"));

  return res.json(ok(product, "Product fetched"));
  }
  catch (error) {
  console.error('Get product by id :', error);
  return res.status(500).json({
    success: false,
    message: 'Product fetch by id failed',
    error: error instanceof Error ? error.message : String(error),
  });
}

}

// =========================================================
//  3. CREATE  —  POST /api/product        (admin only)
// =========================================================
export async function create(req: any, res: any) {
  const parsed = ProductSchema.safeParse(req.body);
  try{
 if (!parsed.success) {
    return res.status(400).json(fail("Validation failed", parsed.error));
  }
  const d = parsed.data;

  const id = await createProduct(
    d.name, d.description, d.price, d.stock, d.category, d.imageUrl
  );

  return res.status(201).json(
    ok({ id, createdBy: req.user.email }, "Product created")
  );
  }catch (error) {
  console.error('Add product:', error);
  return res.status(500).json({
    success: false,
    message: 'Product creation failed',
    error: error instanceof Error ? error.message : String(error),
  });
}
}

// =========================================================
//  4. UPDATE  —  PUT /api/product/:id     (admin only)
// =========================================================
export async function update(req: any, res: any) {
  const id = Number(req.params.id);
 try{
   if (!id) return res.status(400).json(fail("Invalid product id"));

  const parsed = ProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(fail("Validation failed", parsed.error));
  }
  const d = parsed.data;

  const changed = await updateProduct(
    id, d.name, d.description, d.price, d.stock, d.category, d.imageUrl
  );
  if (!changed) return res.status(404).json(fail("Product not found"));

  return res.json(ok({ id }, "Product updated"));
 }
  catch (error) {
  console.error('Update product:', error);
  return res.status(500).json({
    success: false,
    message: 'Product update failed',
    error: error instanceof Error ? error.message : String(error),
  });
}
  
}

// =========================================================
//  5. REMOVE (soft delete)  —  DELETE /api/product/:id   (admin only)
// =========================================================
export async function remove(req: any, res: any) {
  const id = Number(req.params.id);
try{
    if (!id) return res.status(400).json(fail("Invalid product id"));

  const done = await softDeleteProduct(id);
  if (!done) return res.status(404).json(fail("Product not found"));

  return res.json(ok({ id }, "Product removed"));
}catch (error) {
  console.error('Remove product:', error);
  return res.status(500).json({
    success: false,
    message: 'Product removal failed',
    error: error instanceof Error ? error.message : String(error),
  });
}
}
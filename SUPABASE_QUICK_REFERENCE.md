# Supabase Integration Quick Reference

## Current Configuration ✅

- **URL**: https://cjssonslxveyotrsdeln.supabase.co
- **API Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc3NvbnNseHZleW90cnNkZWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjU5ODksImV4cCI6MjA4Nzg0MTk4OX0.vJDSWe0PmpQIb2kpMA8ojXpCq1FJt-cILZNQQmkM2ds
- **Connection**: Centralized in `config/env.ts`, initialized in `lib/supabase.ts`
- **Backup Export**: `utils/supabase.ts` (for backward compatibility)

## Configuration Files

### 1. **config/env.ts** (Primary Configuration)

```typescript
export const SUPABASE_URL = "https://cjssonslxveyotrsdeln.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc3NvbnNseHZleW90cnNkZWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjU5ODksImV4cCI6MjA4Nzg0MTk4OX0.vJDSWe0PmpQIb2kpMA8ojXpCq1FJt-cILZNQQmkM2ds";

```

### 2. **lib/supabase.ts** (Client Initialization)

```typescript
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/config/env";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const checkSupabaseConnection = async (): Promise<boolean>;
```

---

## Key Services

### 1. ✅ Product Management Services

**File**: `services/supabaseService.ts`

#### Read Operations (supabaseProductsService)

```typescript
// Fetch all products
const products = await supabaseProductsService.getAllProducts();

// Fetch by ID
const product = await supabaseProductsService.getProductById(id);

// Get featured products
const featured = await supabaseProductsService.getFeaturedProducts();

// Search products
const results = await supabaseProductsService.searchProducts("coffee");

// Get by price range
const affordable = await supabaseProductsService.getProductsByPriceRange(
  100,
  1000,
);
```

#### Write Operations (supabaseAdminService)

```typescript
// Add new product
const product = await supabaseAdminService.addProduct({
  title: "Product Name",
  price: 999,
  image: "https://imageurl.com/image.jpg",
  shopeeUrl: "https://shopee.co.th/product/123",
  description: "Product description",
  isFeatured: false
});

// Update product
const updated = await supabaseAdminService.updateProduct(productId, {
  title: "New Name",
  price: 1299
});

// Delete product
const deleted = await supabaseAdminService.deleteProduct(productId);

// Add multiple products
const products = await supabaseAdminService.addMultipleProducts([
  { title: "Product 1", price: 999, ... },
  { title: "Product 2", price: 1299, ... }
]);

// Toggle featured status
const toggled = await supabaseAdminService.toggleFeatured(productId);
```

### 2. ✅ Image Upload & Storage

**File**: `services/storage.ts`

```typescript
// Upload image from URL or local file
const publicUrl = await uploadImage(imageUri, userId);

// Get public URL for image in storage
const url = getImagePublicUrl(filePath);

// Delete image from storage
const deleted = await deleteImage(filePath);
```

### 3. ✅ Favorites Management

**File**: `services/supabaseService.ts` (supabaseFavoritesService)

```typescript
// Add to favorites
await supabaseFavoritesService.addFavorite(userId, productId);

// Remove from favorites
await supabaseFavoritesService.removeFavorite(userId, productId);

// Get user's favorites
const favorites = await supabaseFavoritesService.getUserFavorites(userId);

// Check if favorite
const isFav = await supabaseFavoritesService.isFavorite(userId, productId);
```

### 4. ✅ Reviews Management

**File**: `services/supabaseService.ts` (supabaseReviewsService)

```typescript
// Get reviews for a product
const reviews = await supabaseReviewsService.getProductReviews(productId);

// Add review
const review = await supabaseReviewsService.addReview(
  productId,
  userId,
  rating, // 1-5
  "Great product!",
);
```

---

## Testing & Setup Utilities

**File**: `services/supabaseTestUtils.ts`

### Quick Diagnostic

```typescript
import { runFullDiagnostic, printHelp } from "@/services/supabaseTestUtils";

// Run all tests
const diagnostic = await runFullDiagnostic();
console.log(diagnostic.details.join("\n"));

// Display help
printHelp();
```

### Available Test Functions

```typescript
// Test connection
const result = await testConnection();

// Test products table
const tableTest = await testProductsTable();

// Test image upload
const imageTest = await testImageUpload("https://image-url.com/image.jpg");

// Load sample data
const sampleResult = await loadSampleProducts();

// Add a product
const addResult = await addProductWithUrl(
  "Product Name",
  999,
  "https://image-url.com/image.jpg",
  "https://shopee.co.th/product/123",
);

// Export products to JSON
const exported = await exportProductsToJson();
```

---

## Database Tables Required

### 1. **products**

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price INTEGER,
  image TEXT,
  shopeeUrl TEXT,
  description TEXT,
  videoUrl TEXT,
  playlistUrl TEXT,
  reviewUrl TEXT,
  isFeatured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. **favorites** (Optional but recommended)

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3. **reviews** (Optional but recommended)

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  user_id TEXT NOT NULL,
  rating INTEGER, -- 1-5
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Storage Bucket Setup

### Required Bucket: **images**

**Configuration**:

- **Name**: images
- **Type**: Public (to serve images as URLs)
- **Policies**: Allow public read, authenticated/public insert

**Usage**:

```typescript
// Images are stored at: images/{userId}/{timestamp}_{fileName}
// Public URL: https://cjssonslxveyotrsdeln.supabase.co/storage/v1/object/public/images/{userId}/{filename}
```

---

## Setup Checklist

```typescript
import { supabaseProductsService } from "@/services/supabaseService";

// Get all products
const products = await supabaseProductsService.getAllProducts();

// Get single product
const product = await supabaseProductsService.getProductById("product-id");

// Get featured products
const featured = await supabaseProductsService.getFeaturedProducts();

// Search products
const results = await supabaseProductsService.searchProducts("headphones");
```

### 4. ✅ Add/Update Products with Images

**File**: `services/supabaseService.ts`

**Upload Product with Image**:

```typescript
import { supabaseAdminService } from "@/services/supabaseService";

// Add new product
const newProduct = await supabaseAdminService.addProduct({
  title: "Premium Headphones",
  price: 1299,
  description: "High quality audio",
  shopeeUrl: "https://shopee.co.th/product/123",
  imageUri: "file:///path/to/image.jpg", // Required for upload
  isFeatured: true,
});

// Update existing product
const updated = await supabaseAdminService.updateProduct("product-id", {
  title: "Updated Title",
  price: 999,
  imageUri: "file:///path/to/new-image.jpg", // Optional
});

// Delete product
const deleted = await supabaseAdminService.deleteProduct("product-id");

// Add multiple products
const products = await supabaseAdminService.addProductsBulk([
  { title: "Product 1", price: 100, imageUri: "..." },
  { title: "Product 2", price: 200, imageUri: "..." },
]);
```

### 5. ✅ Image Upload/Delete

**File**: `services/storage.ts`

**Upload Image**:

```typescript
import { uploadImage, deleteImage } from "@/services/storage";

// Upload image
const publicUrl = await uploadImage(
  "file:///path/to/image.jpg",
  "user-id", // User ID folder
);
console.log("Image URL:", publicUrl);

// Delete image
const deleted = await deleteImage(publicUrl);
```

### 6. ✅ Favorites Management

**File**: `services/supabaseService.ts`

```typescript
import { supabaseFavoritesService } from "@/services/supabaseService";

// Add to favorites
await supabaseFavoritesService.addFavorite("user-id", "product-id");

// Remove from favorites
await supabaseFavoritesService.removeFavorite("user-id", "product-id");

// Get user's favorites
const favorites = await supabaseFavoritesService.getUserFavorites("user-id");

// Check if favorited
const isFav = await supabaseFavoritesService.isFavorite(
  "user-id",
  "product-id",
);
```

### 7. ✅ Reviews

**File**: `services/supabaseService.ts`

```typescript
import { supabaseReviewsService } from "@/services/supabaseService";

// Get product reviews
const reviews = await supabaseReviewsService.getProductReviews("product-id");

// Add review
const review = await supabaseReviewsService.addReview(
  "product-id",
  "user-id",
  5, // rating 1-5
  "Great product!",
);
```

## Database Schema

### products

| Field       | Type      | Notes                   |
| ----------- | --------- | ----------------------- |
| id          | UUID      | Primary key             |
| title       | text      | Product name (required) |
| price       | integer   | Price in baht           |
| image       | text      | Image URL               |
| shopeeUrl   | text      | Link to Shopee          |
| description | text      | Product description     |
| videoUrl    | text      | YouTube video URL       |
| playlistUrl | text      | YouTube playlist URL    |
| reviewUrl   | text      | Review link             |
| isFeatured  | boolean   | Featured product flag   |
| created_at  | timestamp | Creation date           |

### favorites

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| user_id    | UUID      |
| product_id | UUID      |
| created_at | timestamp |

### reviews

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| product_id | UUID      |
| user_id    | UUID      |
| rating     | integer   |
| comment    | text      |
| created_at | timestamp |

## Error Handling

All functions include error handling and log errors to console:

```typescript
try {
  const product = await supabaseProductsService.getProductById("id");
  if (!product) {
    console.log("Product not found");
  }
} catch (error) {
  console.error("Error:", error);
}
```

## Setup Steps Completed ✅

1. ✅ Supabase connection files configured
2. ✅ SQL schema ready in `sql/create_products.sql`
3. ✅ Real authentication implemented
4. ✅ Product CRUD operations ready
5. ✅ Image upload/delete functions ready
6. ✅ Favorites management ready
7. ✅ Reviews system ready
8. ✅ Full error handling included

## Next Steps

1. **Create Supabase tables** by running `sql/create_products.sql` in Supabase SQL editor
2. **Create storage bucket** named `images` in Supabase Storage
3. **Upload sample data** using `scripts/upload-sample-product.js`
4. **Test the app** by running `npm start`

## Files Modified

- `lib/supabase.ts` - Connection config
- `utils/supabase.ts` - Connection config (mirror)
- `contexts/AuthContext.tsx` - Real Supabase auth
- `services/supabaseService.ts` - Product/review/favorite operations (enhanced)
- `services/storage.ts` - Image upload/delete (enhanced)

## Files Created

- `SUPABASE_SETUP.md` - Detailed setup guide
- `SUPABASE_QUICK_REFERENCE.md` - This file

All systems ready to go! 🚀

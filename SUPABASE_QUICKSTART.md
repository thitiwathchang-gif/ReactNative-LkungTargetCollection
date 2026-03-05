# 🚀 Supabase Integration - Quick Start Guide

## ✅ What's Been Configured

Your React Native app is now fully configured to work with Supabase. Here's what's set up:

### 1. **Credentials Centralized** ✓

- Location: `config/env.ts`
- URL: https://cjssonslxveyotrsdeln.supabase.co
- API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc3NvbnNseHZleW90cnNkZWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjU5ODksImV4cCI6MjA4Nzg0MTk4OX0.vJDSWe0PmpQIb2kpMA8ojXpCq1FJt-cILZNQQmkM2ds
- **Status**: Ready to use

### 2. **Supabase Client** ✓

- Location: `lib/supabase.ts`
- Connection health check function included
- **Status**: Ready to use

### 3. **Product Services** ✓

- Location: `services/supabaseService.ts`
- Features: Read, Create, Update, Delete products
- Image upload support
- Search and filtering
- **Status**: Ready to use

### 4. **Image Storage** ✓

- Location: `services/storage.ts`
- Features: Upload, delete, retrieve images
- Works with local files and URLs
- **Status**: Ready to use

### 5. **Test Utilities** ✓

- Location: `services/supabaseTestUtils.ts`
- Test connection, products table, image upload
- Load sample data
- Run full diagnostics
- **Status**: Ready to use

---

## 🎯 Getting Started - 3 Steps

### Step 1: Set Up Supabase Backend (5 minutes)

**In your Supabase Dashboard** (https://app.supabase.com):

1. **Create Products Table** - Go to SQL Editor:

   ```sql
   CREATE TABLE IF NOT EXISTS public.products (
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

   ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "public_read_products" ON public.products FOR SELECT USING (true);
   ```

2. **Create Storage Bucket** - Go to Storage:
   - Click "Create a new bucket"
   - Name: `images`
   - Public ✓
   - Click Create

3. **Set Storage Policy** - Go to Storage → images → Policies:
   - Click "New Policy"
   - Type: SELECT
   - Create policy to allow public read:
     ```sql
     CREATE POLICY "public_read_images" ON storage.objects
     FOR SELECT USING (bucket_id = 'images');
     ```
   - Add INSERT policy for uploads:
     ```sql
     CREATE POLICY "public_upload_images" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'images');
     ```

### Step 2: Test Connection in Your App

Run this in your app or browser console:

```typescript
import { runFullDiagnostic, printHelp } from "@/services/supabaseTestUtils";

// Test everything
const diagnostic = await runFullDiagnostic();
console.log(diagnostic.details.join("\n"));
diagnostic.ready
  ? console.log("✅ ALL READY!")
  : console.log("❌ Fix issues above");
```

### Step 3: Load Sample Data (Optional)

```typescript
import { loadSampleProducts } from "@/services/supabaseTestUtils";

const result = await loadSampleProducts();
console.log(result.message);
// ✅ Loaded 5 sample products
```

---

## 📚 Common Operations

### Add a New Product

```typescript
import { supabaseAdminService } from "@/services/supabaseService";

const product = await supabaseAdminService.addProduct({
  title: "Awesome Coffee Maker",
  price: 2999,
  image: "https://example.com/image.jpg",
  shopeeUrl: "https://shopee.co.th/product/123",
  description: "Make perfect coffee every time",
  isFeatured: true,
});

console.log("Product added:", product?.id);
```

### Fetch All Products

```typescript
import { supabaseProductsService } from "@/services/supabaseService";

const products = await supabaseProductsService.getAllProducts();
console.log(`Found ${products.length} products`);
```

### Search Products

```typescript
const results = await supabaseProductsService.searchProducts("coffee");
console.log("Search results:", results);
```

### Upload Image, Then Add Product

```typescript
import { uploadImage } from "@/services/storage";
import { supabaseAdminService } from "@/services/supabaseService";

// Upload image first
const publicUrl = await uploadImage("file:///path/to/image.jpg", "user-123");

// Add product with uploaded image
const product = await supabaseAdminService.addProduct({
  title: "My Product",
  price: 999,
  image: publicUrl,
  shopeeUrl: "https://shopee.co.th/product/456",
});
```

### Update Product

```typescript
const updated = await supabaseAdminService.updateProduct(productId, {
  title: "Updated Title",
  price: 1299,
});
```

### Delete Product

```typescript
const deleted = await supabaseAdminService.deleteProduct(productId);
if (deleted) console.log("Product deleted");
```

---

## 🐛 Troubleshooting

### Error: "Bucket not found"

- ✅ Solution: Make sure you created the "images" bucket in Supabase
- Go to Storage in Supabase dashboard and verify

### Error: "Permission denied"

- ✅ Solution: Check storage bucket RLS policies
- Make sure SELECT and INSERT policies are enabled

### Error: "Cannot read products"

- ✅ Solution: Create the products table (Step 1 above)
- Run the SQL in Supabase SQL Editor

### Connection timeout

- ✅ Solution: Check internet connection
- Verify Supabase URL and API Key in `config/env.ts`

---

## 📁 File Structure Reference

```
config/
  └─ env.ts           ← Supabase credentials

lib/
  └─ supabase.ts      ← Client initialization

services/
  ├─ supabaseService.ts    ← Product CRUD operations
  ├─ storage.ts            ← Image upload/delete
  └─ supabaseTestUtils.ts  ← Testing utilities

utils/
  └─ supabase.ts      ← Re-export (backward compatibility)
```

---

## 📚 Complete Documentation

- **Setup Guide**: [SUPABASE_COMPLETE_SETUP.md](SUPABASE_COMPLETE_SETUP.md)
- **Quick Reference**: [SUPABASE_QUICK_REFERENCE.md](SUPABASE_QUICK_REFERENCE.md)
- **Official Docs**: https://supabase.com/docs

---

## ✨ You're All Set!

Your app is now ready to:

- ✅ Connect to Supabase
- ✅ Upload and display images
- ✅ Store product data
- ✅ Search and filter products
- ✅ Manage favorites and reviews

Start building! 🎉

---

## 📞 Need Help?

**Test Functions Available**:

- `testConnection()` - Check Supabase connection
- `testProductsTable()` - Check products table
- `testImageUpload()` - Check image upload
- `runFullDiagnostic()` - Run all tests
- `printHelp()` - Show all available functions

```typescript
import * as sup from "@/services/supabaseTestUtils";
sup.printHelp(); // Show command list
```

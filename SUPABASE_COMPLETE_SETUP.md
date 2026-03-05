# Supabase Complete Setup Guide

## Credentials

Your Supabase project is configured with:

- **Project URL**:https://cjssonslxveyotrsdeln.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc3NvbnNseHZleW90cnNkZWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjU5ODksImV4cCI6MjA4Nzg0MTk4OX0.vJDSWe0PmpQIb2kpMA8ojXpCq1FJt-cILZNQQmkM2ds

These are already configured in:

- `config/env.ts` (centralized configuration)
- `lib/supabase.ts` (client initialization)
- `utils/supabase.ts` (backward compatibility export)

---

## Step 1: Create Database Tables

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** in the sidebar
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Create products table
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

-- Create index for title search
CREATE INDEX IF NOT EXISTS products_title_idx ON public.products USING GIN (to_tsvector('simple', COALESCE(title, '')));

-- Enable RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products
CREATE POLICY "public_read_products" ON public.products
  FOR SELECT USING (true);

-- Allow authenticated users to insert products
CREATE POLICY "authenticated_insert_products" ON public.products
  FOR INSERT WITH CHECK (AUTH.role() = 'authenticated');

-- Allow authenticated users to update their own products
CREATE POLICY "authenticated_update_products" ON public.products
  FOR UPDATE USING (AUTH.role() = 'authenticated');
```

6. Click **Run** (Ctrl+Enter)

---

## Step 2: Create Storage Bucket for Images

1. Go to **Storage** in the sidebar
2. Click **Create a new bucket**
3. **Bucket name**: `images`
4. **Public** or **Private**: Select **Public** (or Private if you manage access via policies)
5. Click **Create bucket**

---

## Step 3: Set Storage Bucket Policies

### For Public Bucket (Anyone can read):

1. Go to **Storage** > **images** bucket
2. Click **Policies** tab
3. Create policy for **SELECT** (Read):
   - Click **New Policy**
   - Choose **For queries with SELECT**:

```sql
-- SELECT policy: Anyone can read
CREATE POLICY "public_read_images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');
```

4. Create policy for **INSERT** (Upload):
   - Click **New Policy** again
   - Choose **For queries with INSERT**:

```sql
-- INSERT policy: Authenticated users or public can upload
CREATE POLICY "public_upload_images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images'
  );
```

5. Create policy for **DELETE** (Optional - for cleanup):

```sql
-- DELETE policy: Authenticated users can delete their own uploads
CREATE POLICY "authenticated_delete_images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images' AND
    AUTH.role() = 'authenticated'
  );
```

---

## Step 4: Test the Connection

Run the health check command:

```bash
npm run test-connection 2>/dev/null || node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://cjssonslxveyotrsdeln.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc3NvbnNseHZleW90cnNkZWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjU5ODksImV4cCI6MjA4Nzg0MTk4OX0.vJDSWe0PmpQIb2kpMA8ojXpCq1FJt-cILZNQQmkM2ds'
);
supabase.from('products').select('COUNT(*)', { count: 'exact', head: true })
  .then(r => console.log(r.error ? 'Failed: ' + r.error.message : 'Connected!'))
  .catch(e => console.log('Error: ' + e.message));
"
```

Or test from the app by importing and calling:

```typescript
import { checkSupabaseConnection } from "@/lib/supabase";

const isConnected = await checkSupabaseConnection();
console.log("Supabase connected:", isConnected);
```

---

## Step 5: Upload Sample Products

### Option A: Using the Upload Script

```bash
# Set environment variables and run upload script
$env:SUPABASE_URL = "https://cjssonslxveyotrsdeln.supabase.co"
$env:SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc3NvbnNseHZleW90cnNkZWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjU5ODksImV4cCI6MjA4Nzg0MTk4OX0.vJDSWe0PmpQIb2kpMA8ojXpCq1FJt-cILZNQQmkM2ds"

node scripts/upload-sample-product.js `
  "https://via.placeholder.com/300x300?text=Sample+Product" `
  "Sample Product 1" `
  "999" `
  "https://shopee.co.th/product/123"
```

### Option B: Using the App Service Functions

```typescript
import { supabaseAdminService } from "@/services/supabaseService";
import { uploadImage } from "@/services/storage";

// Upload image and product
const publicUrl = await uploadImage("file:///path/to/image.jpg", "userId");

const product = await supabaseAdminService.addProduct({
  title: "Sample Product",
  price: 999,
  image: publicUrl,
  shopeeUrl: "https://shopee.co.th/product/123",
  description: "A great product",
  isFeatured: false,
});
```

---

## Step 6: Verify Everything Works

### Check Products Table:

```typescript
import { supabaseProductsService } from "@/services/supabaseService";

const products = await supabaseProductsService.getAllProducts();
console.log("Products:", products);
```

### Check Image Upload:

The images should be accessible at:

```
https://cjssonslxveyotrsdeln.supabase.co/storage/v1/object/public/images/{userId}/{filename}
```

---

## Troubleshooting

### Error: "Bucket not found"

- Make sure the bucket name is exactly `images`
- Go to **Storage** and verify the bucket exists

### Error: "Not allowed to upload"

- Check storage bucket policies
- Make sure the INSERT policy is enabled
- Verify the bucket is public or has proper RLS policies

### Error: "Permission denied"

- Check table RLS policies
- Make sure SELECT policy exists for products
- For writes, ensure INSERT policy allows your user role

### Connection Failed

- Verify Supabase URL and Anon Key are correct
- Check that your Supabase project is active
- Ensure internet connection is working

---

## Configuration Files

The Supabase client is configured in these files:

1. **config/env.ts** - Central configuration (credentials)
2. **lib/supabase.ts** - Client initialization and utilities
3. **services/supabaseService.ts** - Product CRUD operations
4. **services/storage.ts** - Image upload utilities

All configurations use the same credentials and URL for consistency.

---

## Next Steps

1. ✅ Create database tables (Step 1)
2. ✅ Create storage bucket (Step 2)
3. ✅ Set up RLS policies (Step 3)
4. ✅ Test connection (Step 4)
5. ✅ Upload sample data (Step 5)
6. Start building your app!

For more help, see:

- [Supabase Documentation](https://supabase.com/docs)
- [JavaScript Client Reference](https://supabase.com/docs/reference/javascript)
- [Storage Documentation](https://supabase.com/docs/guides/storage)

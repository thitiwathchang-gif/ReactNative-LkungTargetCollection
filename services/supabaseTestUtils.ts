/**
 * Supabase Test & Setup Utilities
 *
 * This file provides utilities to test your Supabase connection and
 * manage product uploads directly from your React Native app.
 */

import { checkSupabaseConnection } from "@/lib/supabase";
import { uploadImage } from "@/services/storage";
import {
    supabaseAdminService,
    supabaseProductsService,
} from "@/services/supabaseService";
import { Product } from "@/types/product";

/**
 * Test basic Supabase connection
 */
export const testConnection = async (): Promise<{
  connected: boolean;
  message: string;
}> => {
  try {
    const isConnected = await checkSupabaseConnection();
    if (isConnected) {
      return {
        connected: true,
        message: "✅ Successfully connected to Supabase!",
      };
    } else {
      return {
        connected: false,
        message: "❌ Failed to connect to Supabase. Check your configuration.",
      };
    }
  } catch (error) {
    return {
      connected: false,
      message: `❌ Connection error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Test products table exists and is accessible
 */
export const testProductsTable = async (): Promise<{
  success: boolean;
  message: string;
  productCount?: number;
}> => {
  try {
    const products = await supabaseProductsService.getAllProducts();
    return {
      success: true,
      message: `✅ Products table is accessible (${products.length} products found)`,
      productCount: products.length,
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Products table error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Test image upload functionality
 */
export const testImageUpload = async (
  imageUrl: string,
): Promise<{
  success: boolean;
  message: string;
  publicUrl?: string;
}> => {
  try {
    console.log("Testing image upload with URL:", imageUrl);
    const publicUrl = await uploadImage(imageUrl, "test-user");

    if (publicUrl === imageUrl) {
      return {
        success: false,
        message:
          "⚠️ Image upload fallback - check storage bucket configuration",
        publicUrl,
      };
    }

    return {
      success: true,
      message: "✅ Image uploaded successfully",
      publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Image upload error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Run full system diagnostic
 */
export const runFullDiagnostic = async (): Promise<{
  connection: boolean;
  productsTable: boolean;
  imageUpload: boolean;
  ready: boolean;
  details: string[];
}> => {
  const details: string[] = [];

  // Test 1: Connection
  const connTest = await testConnection();
  details.push(connTest.message);

  // Test 2: Products Table
  const tableTest = await testProductsTable();
  details.push(tableTest.message);

  // Test 3: Image Upload
  const imageTest = await testImageUpload(
    "https://via.placeholder.com/300x300?text=Test+Image",
  );
  details.push(imageTest.message);

  const allPassed =
    connTest.connected && tableTest.success && imageTest.success;

  return {
    connection: connTest.connected,
    productsTable: tableTest.success,
    imageUpload: imageTest.success,
    ready: allPassed,
    details,
  };
};

/**
 * Load sample products to get started
 */
export const loadSampleProducts = async (): Promise<{
  success: boolean;
  message: string;
  productsAdded?: number;
}> => {
  try {
    const sampleProducts: Array<Partial<Product> & { imageUri?: string }> = [
      {
        title: "Premium Coffee Maker",
        price: 2999,
        image: "https://via.placeholder.com/300x300?text=Coffee+Maker",
        shopeeUrl: "https://shopee.co.th/product/coffee-maker",
        description:
          "High-quality coffee maker with advanced brewing technology",
        isFeatured: true,
      },
      {
        title: "Wireless Headphones",
        price: 1499,
        image: "https://via.placeholder.com/300x300?text=Headphones",
        shopeeUrl: "https://shopee.co.th/product/wireless-headphones",
        description: "Premium sound quality with noise cancellation",
        isFeatured: true,
      },
      {
        title: "Smart Watch",
        price: 3499,
        image: "https://via.placeholder.com/300x300?text=Smart+Watch",
        shopeeUrl: "https://shopee.co.th/product/smart-watch",
        description: "Track your fitness and stay connected on the go",
        isFeatured: false,
      },
      {
        title: "Portable Speaker",
        price: 899,
        image: "https://via.placeholder.com/300x300?text=Speaker",
        shopeeUrl: "https://shopee.co.th/product/speaker",
        description: "Waterproof portable speaker with amazing sound",
        isFeatured: false,
      },
      {
        title: "USB-C Cable Pack",
        price: 299,
        image: "https://via.placeholder.com/300x300?text=USB+Cable",
        shopeeUrl: "https://shopee.co.th/product/usb-cable",
        description: "Pack of 3 high-quality USB-C cables",
        isFeatured: false,
      },
    ];

    // Check if sample products already exist
    const existingProducts = await supabaseProductsService.getAllProducts();
    if (existingProducts.length > 0) {
      return {
        success: true,
        message: `✅ Sample products already exist (${existingProducts.length} products)`,
        productsAdded: 0,
      };
    }

    // Add sample products
    const added =
      await supabaseAdminService.addMultipleProducts(sampleProducts);

    return {
      success: true,
      message: `✅ Loaded ${added.length} sample products`,
      productsAdded: added.length,
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Error loading sample products: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Add a single product with URL-based image
 */
export const addProductWithUrl = async (
  title: string,
  price: number,
  imageUrl: string,
  shopeeUrl: string,
  description?: string,
  isFeatured?: boolean,
): Promise<{
  success: boolean;
  message: string;
  product?: Product;
}> => {
  try {
    const product = await supabaseAdminService.addProduct({
      title,
      price,
      image: imageUrl,
      shopeeUrl,
      description,
      isFeatured: isFeatured ?? false,
    });

    if (!product) {
      return {
        success: false,
        message: "❌ Failed to add product (no data returned)",
      };
    }

    return {
      success: true,
      message: `✅ Product added: ${product.title}`,
      product,
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Error adding product: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Delete all products (use with caution!)
 */
export const deleteAllProducts = async (): Promise<{
  success: boolean;
  message: string;
  deletedCount?: number;
}> => {
  try {
    const products = await supabaseProductsService.getAllProducts();

    if (products.length === 0) {
      return {
        success: true,
        message: "✅ No products to delete",
        deletedCount: 0,
      };
    }

    let deletedCount = 0;
    for (const product of products) {
      const deleted = await supabaseAdminService.deleteProduct(product.id);
      if (deleted) deletedCount++;
    }

    return {
      success: true,
      message: `✅ Deleted ${deletedCount} products`,
      deletedCount,
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Error deleting products: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Export products to JSON for backup
 */
export const exportProductsToJson = async (): Promise<{
  success: boolean;
  message: string;
  jsonData?: string;
  count?: number;
}> => {
  try {
    const products = await supabaseProductsService.getAllProducts();

    const jsonData = JSON.stringify(products, null, 2);

    return {
      success: true,
      message: `✅ Exported ${products.length} products`,
      jsonData,
      count: products.length,
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Error exporting products: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Log all available utility functions
 */
export const printHelp = (): void => {
  const help = `
╔════════════════════════════════════════════════════════════╗
║  Supabase Test & Setup Utilities                          ║
╚════════════════════════════════════════════════════════════╝

Available Functions:

1. testConnection()
   → Test if you're connected to Supabase

2. testProductsTable()
   → Test if the products table exists and is accessible

3. testImageUpload(imageUrl)
   → Test image upload functionality

4. runFullDiagnostic()
   → Run all tests (connection, table, image upload)

5. loadSampleProducts()
   → Load 5 sample products into the database

6. addProductWithUrl(title, price, imageUrl, shopeeUrl, description?, isFeatured?)
   → Add a single product with a URL-based image

7. deleteAllProducts()
   → Delete all products (use with caution!)

8. exportProductsToJson()
   → Export all products to JSON format

9. printHelp()
   → Display this help message

USAGE EXAMPLES:
──────────────

// Test your connection
const result = await testConnection();
console.log(result.message);

// Run full system check
const diagnostic = await runFullDiagnostic();
console.log(diagnostic.details.join('\\n'));

// Load sample data
const sampleResult = await loadSampleProducts();
console.log(sampleResult.message);

// Add a product
const addResult = await addProductWithUrl(
  "My Product",
  999,
  "https://example.com/image.jpg",
  "https://shopee.co.th/product/123"
);
console.log(addResult.message);
`;

  console.log(help);
};

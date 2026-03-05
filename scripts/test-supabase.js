#!/usr/bin/env node
/**
 * Supabase Connection Test & Setup Script
 *
 * This script helps you test your Supabase connection and verify the setup.
 *
 * Usage:
 *   node scripts/test-supabase.js [command]
 *
 * Commands:
 *   test-connection  - Test basic Supabase connection
 *   test-table       - Test products table
 *   test-image       - Test image upload
 *   diagnostic       - Run all tests
 *   load-samples     - Load 5 sample products
 *   help             - Show this help message
 *
 * Default (no command): Run full diagnostic
 */

const { createClient } = require("@supabase/supabase-js");
const fetch = require("node-fetch");

const SUPABASE_URL = "https://cjssonslxveyotrsdeln.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc3NvbnNseHZleW90cnNkZWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjU5ODksImV4cCI6MjA4Nzg0MTk4OX0.vJDSWe0PmpQIb2kpMA8ojXpCq1FJt-cILZNQQmkM2ds";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.blue}${msg}${colors.reset}`),
};

// Test 1: Connection
async function testConnection() {
  log.title("🔌 Testing Supabase Connection...");
  try {
    const { data, error } = await supabase
      .from("products")
      .select("COUNT(*)", { count: "exact", head: true });

    if (error) throw error;
    log.success("Connected to Supabase!");
    return true;
  } catch (error) {
    log.error(
      `Connection failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return false;
  }
}

// Test 2: Products Table
async function testProductsTable() {
  log.title("📊 Testing Products Table...");
  try {
    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" });

    if (error) throw error;
    log.success(`Products table accessible (${count || 0} products found)`);
    if (data && data.length > 0) {
      log.info(`Sample product: "${data[0].title}"`);
    }
    return true;
  } catch (error) {
    if (error && error.message && error.message.includes("relation")) {
      log.error(
        "Products table not found. Run the SQL setup in Step 1 of SUPABASE_QUICKSTART.md",
      );
    } else {
      log.error(
        `Table test failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return false;
  }
}

// Test 3: Image Upload
async function testImageUpload() {
  log.title("🖼️  Testing Image Upload...");
  try {
    const testImageUrl = "https://via.placeholder.com/300x300?text=Test+Upload";
    const response = await fetch(testImageUrl);
    const blob = await response.blob();

    const fileName = `test_${Date.now()}.jpg`;
    const filePath = `test-user/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, blob, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    log.success("Image uploaded successfully!");
    log.info(`Public URL: ${publicData.publicUrl}`);

    // Clean up
    try {
      await supabase.storage.from("images").remove([filePath]);
      log.info("Test image cleaned up");
    } catch (e) {}

    return true;
  } catch (error) {
    if (error && error.message && error.message.includes("Not found")) {
      log.error(
        'Storage bucket "images" not found. Create it in Supabase Storage.',
      );
    } else if (error && error.message && error.message.includes("Permission")) {
      log.warning(
        "Permission denied. Check storage bucket RLS policies are set correctly.",
      );
    } else {
      log.error(
        `Image upload test failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return false;
  }
}

// Test 4: Full Diagnostic
async function runDiagnostic() {
  log.title("🔍 Running Full System Diagnostic...");

  const connResult = await testConnection();
  const tableResult = await testProductsTable();
  const imageResult = await testImageUpload();

  log.title("📋 Diagnostic Summary:");
  console.log(
    `  Connection:    ${connResult ? colors.green + "✅ PASS" : colors.red + "❌ FAIL"}${colors.reset}`,
  );
  console.log(
    `  Products Table: ${tableResult ? colors.green + "✅ PASS" : colors.red + "❌ FAIL"}${colors.reset}`,
  );
  console.log(
    `  Image Upload:   ${imageResult ? colors.green + "✅ PASS" : colors.red + "❌ FAIL"}${colors.reset}`,
  );

  const allPass = connResult && tableResult && imageResult;
  console.log("");
  if (allPass) {
    log.success("🎉 All systems ready! You're good to go!");
  } else {
    log.warning("⚠️  Some tests failed. Review the errors above.");
    log.info("Check SUPABASE_QUICKSTART.md for setup instructions.");
  }

  return allPass;
}

// Load Sample Products
async function loadSampleProducts() {
  log.title("📦 Loading Sample Products...");

  try {
    // Check if products already exist
    const { data: existingProducts, error: selectError } = await supabase
      .from("products")
      .select("id");

    if (selectError) throw selectError;

    if (existingProducts && existingProducts.length > 0) {
      log.warning(
        `Products already exist (${existingProducts.length} found). Skipping sample load.`,
      );
      return;
    }

    const sampleProducts = [
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

    const { data: insertedData, error: insertError } = await supabase
      .from("products")
      .insert(sampleProducts)
      .select();

    if (insertError) throw insertError;

    log.success(`Loaded ${insertedData?.length || 0} sample products!`);
    if (insertedData) {
      insertedData.forEach((p) => {
        console.log(`  • ${p.title} - ฿${p.price}`);
      });
    }
  } catch (error) {
    log.error(
      `Failed to load samples: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// Help message
function showHelp() {
  const help = `
${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}
${colors.blue}║  Supabase Test & Setup Utility                            ║${colors.reset}
${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}

${colors.cyan}USAGE:${colors.reset}
  node scripts/test-supabase.js [command]

${colors.cyan}COMMANDS:${colors.reset}
  test-connection   Test connection to Supabase
  test-table        Test if products table exists
  test-image        Test image upload functionality
  diagnostic        Run all tests (default)
  load-samples      Load 5 sample products
  help              Show this help message

${colors.cyan}EXAMPLES:${colors.reset}
  node scripts/test-supabase.js
  node scripts/test-supabase.js diagnostic
  node scripts/test-supabase.js test-connection
  node scripts/test-supabase.js load-samples

${colors.cyan}SETUP STEPS:${colors.reset}
  1. Read SUPABASE_QUICKSTART.md for initial setup
  2. Run: node scripts/test-supabase.js diagnostic
  3. If tests pass, run: node scripts/test-supabase.js load-samples
  4. Start using Supabase in your app!

${colors.cyan}CONFIGURATION:${colors.reset}
  URL:     ${SUPABASE_URL}
  API Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...

`;
  console.log(help);
}

// Main
async function main() {
  const command = process.argv[2] || "diagnostic";

  switch (command) {
    case "test-connection":
      await testConnection();
      break;
    case "test-table":
      await testProductsTable();
      break;
    case "test-image":
      await testImageUpload();
      break;
    case "diagnostic":
      await runDiagnostic();
      break;
    case "load-samples":
      await loadSampleProducts();
      break;
    case "help":
      showHelp();
      break;
    default:
      log.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

main().catch((error) => {
  log.error(
    `Script error: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});

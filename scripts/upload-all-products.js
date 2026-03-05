#!/usr/bin/env node
/**
 * Upload all products from shopee data with images to Supabase
 * Usage:
 *   SUPABASE_URL=https://... SUPABASE_ANON_KEY=... node scripts/upload-all-products.js
 * 
 * This script will:
 * 1. Download all product images
 * 2. Upload them to Supabase storage
 * 3. Insert product records into the database
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const fetch = require("node-fetch");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Product data from shopee
const productsData = [
  {
    id: "1",
    title: "T-Rex Nanmu Smart Series Alpha 3.0 สีน้ำตาล",
    price: 4995,
    image:
      "https://scontent.fbkk12-3.fna.fbcdn.net/v/t39.30808-6/537269920_1370016071593623_253272574871282016_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=WslXaO6MJc0Q7kNvwGEfph0&_nc_oc=AdnPcBZ0-ocNVIV-lWtag3FlYVR7-Zs_ZhHQPdOAM1xs3y_CSp326WuCuXfDI-vYitGB65CEhOzwTrrYhuGDGb2E&_nc_zt=23&_nc_ht=scontent.fbkk12-3.fna&_nc_gid=UctAclnhNwWwIfzjoOWLuQ&oh=00_AfurS3DhoPoYf2fAeYVITZAiw2Pd66HC4wylxNE0p78W-Q&oe=6988C715",
    image_url: "https://scontent.fbkk12-3.fna.fbcdn.net/v/t39.30808-6/537269920_1370016071593623_253272574871282016_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=WslXaO6MJc0Q7kNvwGEfph0&_nc_oc=AdnPcBZ0-ocNVIV-lWtag3FlYVR7-Zs_ZhHQPdOAM1xs3y_CSp326WuCuXfDI-vYitGB65CEhOzwTrrYhuGDGb2E&_nc_zt=23&_nc_ht=scontent.fbkk12-3.fna&_nc_gid=UctAclnhNwWwIfzjoOWLuQ&oh=00_AfurS3DhoPoYf2fAeYVITZAiw2Pd66HC4wylxNE0p78W-Q&oe=6988C715",
    shopeeUrl: "https://s.shopee.co.th/AKUrYrTiXo",
    videoUrl: "https://youtu.be/1kWDEjiJXjc?si=ltiy4ClqJ7S9xPov62",
    isFeatured: true,
  },
  {
    id: "2",
    title: "Mattel Jurassic World by official Wangdek",
    price: 9999,
    image:
      "https://i.ytimg.com/vi/-_RB3r3uGiY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDkEbDlVB8EfjmX6SfiE32utreorQ",
    image_url: "https://collectjurassic.com/wp-content/uploads/2022/06/DominionToysFtr.jpg",
    shopeeUrl: "https://th.shp.ee/5rJdxsG",
    playlistUrl:
      "https://youtube.com/playlist?list=PLcEypFWfI8oXnbSA09ef6v-ZB0CQxupK8&si=2mn7AEsUrq_v4pkC",
    isFeatured: true,
  },
  {
    id: "3",
    title: "Mattel Jurassic World by Home Monster Toys",
    price: 9999,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5HNvJTX4esdPMZf8XUmKVdBqs-fy8JTOorQ&s",
    shopeeUrl: "https://th.shp.ee/FwM8oN7",
    playlistUrl:
      "https://youtube.com/playlist?list=PLcEypFWfI8oXnbSA09ef6v-ZB0CQxupK8&si=2mn7AEsUrq_v4pkC",
    isFeatured: true,
  },
  {
    id: "4",
    title: "Jurassic Park/World และของเล่นอื่นๆ by ร้านน้าเดช",
    price: 9999,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS94RTARAITKvdQqM7KnpyArjeco4LlsgJdPA&s",
    shopeeUrl: "https://s.shopee.co.th/9zs1BUCX0d",
    playlistUrl:
      "https://youtube.com/playlist?list=PLcEypFWfI8oXnbSA09ef6v-ZB0CQxupK8&si=2mn7AEsUrq_v4pkC",
    isFeatured: true,
  },
];

async function downloadToTempFile(url) {
  // some hosts (e.g. google/ytimg) reject requests without a browser UA
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`Failed to download image: ${res.statusText}`);
  const buf = await res.arrayBuffer();
  const tmpPath = path.join(os.tmpdir(), `upload_${Date.now()}.jpg`);
  fs.writeFileSync(tmpPath, Buffer.from(buf));
  return tmpPath;
}

async function uploadProductWithImage(product) {
  console.log(`\n📦 Processing: ${product.title}`);

  // Use image_url if available, otherwise use image
  const imageUrl = product.image_url || product.image;

  let publicUrl = imageUrl; // fallback to original if upload fails
  let downloadedTmpFile = null;

  // attempt download & upload, but don't abort entire process if it fails
  try {
    console.log("  ⬇️  Downloading image...");
    downloadedTmpFile = await downloadToTempFile(imageUrl);

    const userId = "public";
    const fileName = path.basename(downloadedTmpFile);
    const filePath = `${userId}/${Date.now()}_${fileName}`;

    console.log(`  ⬆️  Uploading to Supabase storage...`);
    const bucket = process.env.SUPABASE_BUCKET || "images";
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, fs.createReadStream(downloadedTmpFile), {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("    Supabase upload error details:", uploadError);
      throw uploadError;
    }

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    publicUrl = publicData.publicUrl;
    console.log(`  🔗 Public URL: ${publicUrl}`);
  } catch (err) {
    console.warn(`  ⚠️ Could not download/upload image (${err.message}).
    Falling back to original URL.`);
  } finally {
    if (downloadedTmpFile) {
      try {
        fs.unlinkSync(downloadedTmpFile);
      } catch {}
    }
  }

  try {
    console.log(`  💾 Inserting product record...`);
    const { data: productData, error: insertError } = await supabase
      .from("products")
      .insert({
        id: product.id,
        title: product.title,
        price: product.price,
        image: publicUrl,
        image_url: publicUrl,
        shopeeUrl: product.shopeeUrl,
        videoUrl: product.videoUrl,
        playlistUrl: product.playlistUrl,
        isFeatured: product.isFeatured,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log(`  ✅ Success: ${product.id}`);
    return productData;
  } catch (insertErr) {
    console.error(`  ❌ DB insert error:`, insertErr.message);
    return null;
  }
}

async function main() {
  console.log(
    "\n🚀 Starting product upload to Supabase...\n" +
    "=" .repeat(50),
  );

  const results = [];

  for (const product of productsData) {
    const result = await uploadProductWithImage(product);
    if (result) {
      results.push(result);
    }
  }

  console.log(
    "\n" + "=".repeat(50) +
    `\n✨ Upload complete! ${results.length}/${productsData.length} products uploaded successfully.\n`,
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

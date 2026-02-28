#!/usr/bin/env node
/*
  Sample script to upload an image to Supabase Storage and insert a product row.
  Usage:
    SUPABASE_URL=https://... SUPABASE_ANON_KEY=... node scripts/upload-sample-product.js <imageUrl> "Product Title" <price> <shopeeUrl>

  Requires: node (18+ recommended) or install node-fetch
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

async function downloadToTempFile(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.statusText}`);
  const buf = await res.arrayBuffer();
  const tmpPath = path.join(os.tmpdir(), `upload_${Date.now()}.jpg`);
  fs.writeFileSync(tmpPath, Buffer.from(buf));
  return tmpPath;
}

async function main() {
  const [
    ,
    ,
    imageUrl,
    title = "Sample Product",
    priceArg = "0",
    shopeeUrl = "",
  ] = process.argv;
  if (!imageUrl) {
    console.error(
      'Usage: node scripts/upload-sample-product.js <imageUrl> "Product Title" <price> <shopeeUrl>',
    );
    process.exit(1);
  }

  try {
    console.log("Downloading image...");
    const tmpFile = await downloadToTempFile(imageUrl);

    const userId = "public";
    const fileName = path.basename(tmpFile);
    const filePath = `${userId}/${Date.now()}_${fileName}`;

    console.log("Uploading to Supabase storage -> images bucket:", filePath);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, fs.createReadStream(tmpFile), {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);
    const publicUrl = publicData.publicUrl;

    console.log("Public URL:", publicUrl);

    const price = parseInt(priceArg, 10) || 0;

    console.log("Inserting product record...");
    const { data: productData, error: insertError } = await supabase
      .from("products")
      .insert({
        title,
        price,
        image: publicUrl,
        shopeeUrl,
        isFeatured: false,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log("Inserted product:", productData);

    // cleanup tmp file
    try {
      fs.unlinkSync(tmpFile);
    } catch (e) {}
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();

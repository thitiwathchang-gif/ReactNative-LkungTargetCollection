import { supabase } from "@/utils/supabase";
import * as FileSystem from "expo-file-system";

export const uploadProductImage = async (uri: string) => {
  const fileExt = uri.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const file = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, Buffer.from(file, "base64"), {
      contentType: `image/${fileExt}`,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
};
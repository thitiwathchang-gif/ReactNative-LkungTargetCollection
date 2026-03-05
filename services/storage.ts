import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage utilities
export const setStorageData = async (
  key: string,
  value: any,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("AsyncStorage error:", error);
  }
};

export const getStorageData = async (key: string): Promise<any> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("AsyncStorage error:", error);
    return null;
  }
};

export const removeStorageData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("AsyncStorage error:", error);
  }
};

export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("AsyncStorage error:", error);
  }
};

// Upload image to Supabase storage. Requires a configured bucket named 'images'.
export const uploadImage = async (
  uri: string,
  userId: string = "public",
): Promise<string> => {
  try {
    if (!uri) {
      throw new Error("No image URI provided");
    }

    // convert uri to blob (works for expo and react-native)
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();

    if (!blob || blob.size === 0) {
      throw new Error("Downloaded blob is empty");
    }

    const fileName = uri.split("/").pop() || `image_${Date.now()}.jpg`;
    const timestamp = Date.now();
    const filePath = `${userId}/${timestamp}_${fileName}`;

    console.log(`Uploading image to: ${filePath}, Size: ${blob.size} bytes`);

    const { data, error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType: blob.type || "image/jpeg",
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;
    console.log("Image uploaded successfully:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("uploadImage error:", error);
    // fallback to returning original uri so UI still works
    return uri;
  }
};

// Get public URL for an existing image in storage
export const getImagePublicUrl = (filePath: string): string => {
  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  return data.publicUrl;
};

// Delete an image from storage
export const deleteImage = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.from("images").remove([filePath]);
    if (error) {
      console.error("Delete image error:", error);
      return false;
    }
    console.log("Image deleted successfully:", filePath);
    return true;
  } catch (error) {
    console.error("deleteImage error:", error);
    return false;
  }
};

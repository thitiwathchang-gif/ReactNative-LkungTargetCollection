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
  userId: string,
): Promise<string> => {
  try {
    // convert uri to blob (works for expo and react-native)
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = uri.split("/").pop() || `${Date.now()}.jpg`;
    const filePath = `${userId}/${Date.now()}_${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, blob, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("uploadImage error:", error);
    // fallback to returning original uri so UI still works
    return uri;
  }
};

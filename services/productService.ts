import { supabase } from "@/utils/supabase";

export const addProduct = async (product: {
  name: string;
  description: string;
  price: number;
  image_url: string;
  youtube_url?: string;
}) => {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select();

  if (error) throw error;
  return data;
};

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
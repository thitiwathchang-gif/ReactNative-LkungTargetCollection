export const downloadToCache = async (
  url: string,
  filename: string
): Promise<string> => {
  console.log("Mock download:", url, filename);
  return url;
};

export const fileExists = async (uri: string): Promise<boolean> => {
  return false;
};
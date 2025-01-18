/**
 * Uploads an image file to Cloudinary and returns its URL.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} - A promise that resolves to the uploaded image URL.
 * @throws {Error} - Throws an error if the upload fails or the file is invalid.
 */
export const uploadImageAndGetUrl = async (file: File): Promise<string> => {
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
    if (!CLOUDINARY_URL || !UPLOAD_PRESET) {
      throw new Error("Cloudinary configuration is missing in environment variables");
    }
  
    if (!file) {
      throw new Error("No file provided for upload");
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
  
    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }
  
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error during image upload:", error);
      throw new Error("Image upload failed");
    }
  };
  
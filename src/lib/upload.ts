/**
 * EquipLoop ImgBB Image Upload Service
 * Integrates with ImgBB REST API using NEXT_PUBLIC_IMGBB_API_KEY.
 */

export interface ImgBBUploadResponse {
  success: boolean;
  url: string;
  displayUrl?: string;
  deleteUrl?: string;
  error?: string;
}

export async function uploadToImgBB(file: File): Promise<ImgBBUploadResponse> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    // If no API key configured, read image as data URL fallback for preview/testing
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          success: true,
          url: reader.result as string,
        });
      };
      reader.onerror = () => {
        resolve({
          success: false,
          url: "",
          error: "Failed to read local file",
        });
      };
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success && data.data?.url) {
      return {
        success: true,
        url: data.data.url,
        displayUrl: data.data.display_url,
        deleteUrl: data.data.delete_url,
      };
    }

    return {
      success: false,
      url: "",
      error: data.error?.message || "ImgBB upload failed",
    };
  } catch (err: any) {
    return {
      success: false,
      url: "",
      error: err.message || "Network error uploading image to ImgBB",
    };
  }
}

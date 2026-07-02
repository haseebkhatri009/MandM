// ImgBB API Utility - Free image hosting
// Get API key from: https://imgbb.com/api

export const uploadToImgBB = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  
  if (!apiKey) {
    throw new Error('ImgBB API key not configured. Add NEXT_PUBLIC_IMGBB_API_KEY to .env.local');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', apiKey);

  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ImgBB upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data.url; // Return the image URL
    } else {
      throw new Error(data.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('[v0] ImgBB upload error:', error);
    throw error;
  }
};

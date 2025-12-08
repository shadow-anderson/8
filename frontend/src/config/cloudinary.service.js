// ============================================================================
// CLOUDINARY UPLOAD SERVICE
// ============================================================================
import { cloudinaryConfig, uploadSettings, resourceTypes } from './cloudinary.config';

/**
 * Upload file to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} folder - The folder path in Cloudinary (e.g., 'dpr', 'evidence')
 * @param {object} options - Additional upload options
 * @returns {Promise<object>} Upload response with URL and metadata
 */
export const uploadToCloudinary = async (file, folder = 'documents', options = {}) => {
  try {
    // Validate configuration
    if (!cloudinaryConfig.cloudName || cloudinaryConfig.cloudName === 'YOUR_CLOUD_NAME') {
      throw new Error('Cloudinary cloud name not configured. Please update cloudinary.config.js');
    }
    
    if (!cloudinaryConfig.uploadPreset || cloudinaryConfig.uploadPreset === 'YOUR_UPLOAD_PRESET') {
      throw new Error('Cloudinary upload preset not configured. Please update cloudinary.config.js');
    }

    // Validate file size
    if (file.size > uploadSettings.maxFileSize) {
      throw new Error(`File size exceeds ${uploadSettings.maxFileSize / 1048576}MB limit`);
    }

    // Determine resource type based on file type
    const fileType = file.type.split('/')[0];
    let resourceType = resourceTypes.raw; // Default to raw for documents

    if (fileType === 'image') {
      resourceType = resourceTypes.image;
    } else if (fileType === 'video') {
      resourceType = resourceTypes.video;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('folder', uploadSettings.folder[folder] || folder);
    
    // Add optional parameters
    if (options.tags) {
      formData.append('tags', options.tags.join(','));
    }
    if (options.context) {
      formData.append('context', JSON.stringify(options.context));
    }

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`;
    
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error?.message || 'Upload failed';
      
      // Provide helpful error messages
      if (errorMessage.includes('preset') || errorMessage.includes('unsigned')) {
        throw new Error(
          'Cloudinary upload preset error. Please ensure:\n' +
          '1. Your upload preset exists in Cloudinary\n' +
          '2. The preset is set to "Unsigned" mode\n' +
          '3. Go to Settings → Upload → Upload presets in Cloudinary Dashboard'
        );
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Return formatted response
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      resourceType: data.resource_type,
      format: data.format,
      size: data.bytes,
      width: data.width,
      height: data.height,
      createdAt: data.created_at,
      originalFilename: file.name,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {FileList|Array} files - Array of files to upload
 * @param {string} folder - The folder path in Cloudinary
 * @param {object} options - Additional upload options
 * @returns {Promise<Array>} Array of upload results
 */
export const uploadMultipleToCloudinary = async (files, folder = 'documents', options = {}) => {
  const fileArray = Array.from(files);
  const uploadPromises = fileArray.map((file) => uploadToCloudinary(file, folder, options));
  
  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @param {string} resourceType - The resource type (image, video, raw)
 * @returns {Promise<object>} Deletion response
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'raw') => {
  try {
    // Note: Deletion requires backend implementation for security
    // This is a placeholder - implement deletion through your backend API
    console.warn('Deletion should be implemented through backend API for security');
    
    // Example backend call:
    // const response = await fetch('/api/cloudinary/delete', {
    //   method: 'DELETE',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ publicId, resourceType }),
    // });
    
    return {
      success: false,
      message: 'Deletion must be implemented through backend API',
    };
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Generate Cloudinary transformation URL
 * @param {string} publicId - The public ID of the file
 * @param {object} transformations - Transformation options
 * @returns {string} Transformed URL
 */
export const getTransformedUrl = (publicId, transformations = {}) => {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = transformations;

  let transformStr = `q_${quality},f_${format}`;
  
  if (width || height) {
    transformStr += `,c_${crop}`;
    if (width) transformStr += `,w_${width}`;
    if (height) transformStr += `,h_${height}`;
  }

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformStr}/${publicId}`;
};

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Validate file type
 * @param {File} file - The file to validate
 * @param {string} category - Category (dpr, evidence, documents)
 * @returns {boolean} Whether file type is allowed
 */
export const isValidFileType = (file, category = 'documents') => {
  const extension = getFileExtension(file.name).toLowerCase();
  const allowedFormats = uploadSettings.allowedFormats[category] || [];
  return allowedFormats.includes(extension);
};

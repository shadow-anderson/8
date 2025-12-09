// ============================================================================
// UPLOADCARE UPLOAD SERVICE
// ============================================================================
import { uploadFile } from '@uploadcare/upload-client';
import { uploadcareConfig } from './uploadcare.config';

/**
 * Upload file to Uploadcare
 * @param {File} file - The file to upload
 * @param {string} folder - Folder path (for your own reference only)
 * @param {object} options - Additional upload options (optional)
 * @returns {Promise<object>} Upload response with URL and metadata
 */
export const uploadToUploadcare = async (file, folder = 'documents', options = {}) => {
    console.log("UPLOAD_TO_UPLOAD_CARE");
    try {
    // Validate public key
    if (!uploadcareConfig.publicKey || uploadcareConfig.publicKey === 'YOUR_PUBLIC_KEY') {
      throw new Error('Uploadcare public key not configured. Please update uploadcare.config.js');
    }

    // Validate file size
    if (file.size > uploadcareConfig.maxFileSize) {
      throw new Error(`File size exceeds ${uploadcareConfig.maxFileSize / 1048576}MB limit`);
    }

    // Upload file to Uploadcare
    const uploadedFile = await uploadFile(file, {
      publicKey: uploadcareConfig.publicKey,
      store: true, // Force permanent storage (changed from 'auto')
      metadata: {
        folder,
        originalFilename: file.name,
        ...options,
      },
    });
    console.log('blah');
    console.log('Uploadcare response:', uploadedFile);
    console.log('Original filename from file parameter:', file.name);
    
    // Build the CDN URL - use cdnUrl from response if available, otherwise construct it
    let fileUrl;
    let fileUrlWithName;
    
    if (uploadedFile.cdnUrl) {
        fileUrl = uploadedFile.cdnUrl;
        const id = new URL(fileUrl).pathname.split("/").filter(Boolean)[0];
        fileUrlWithName = "https://4ggp7sdvnb.ucarecd.net/" + id + "/" + file.name;
        console.log(id);
        console.log("FIINNNNNAAALLL", fileUrlWithName);
      
    } else {
      // Construct URL with correct CDN domain
      fileUrl = `${uploadcareConfig.baseCdnUrl}/${uploadedFile.uuid}/${file.name}`;
      fileUrlWithName = fileUrl;
    }

    console.log('Final file URL:', fileUrl);
   
    // Wait a bit for file to be fully stored (optional but helps with immediate access)
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      url: fileUrl,
      urlWithFilename: fileUrlWithName,
      uuid: uploadedFile.uuid,
      size: uploadedFile.size,
      mimeType: uploadedFile.mimeType,
      originalFilename: file.name,
      createdAt: new Date().toISOString(),
      folder,
    };
  } catch (error) {
    console.error('Uploadcare upload error:', error);
    console.log(error.message)
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload multiple files to Uploadcare
 * @param {FileList|Array} files - Array of files
 * @param {string} folder - Folder path
 * @param {object} options - Additional upload options
 * @returns {Promise<Array>} Array of upload results
 */
export const uploadMultipleToUploadcare = async (files, folder = 'documents', options = {}) => {
    console.log("UPLOAD_MULTIPLE_TO_UPLOAD_CARE")
    const fileArray = Array.from(files);
  const results = [];
  for (const file of fileArray) {
    const result = await uploadToUploadcare(file, folder, options);
    results.push(result);
  }

  return results;
};

/**
 * Delete file from Uploadcare (requires backend signed request)
 * @param {string} uuid - UUID of the uploaded file
 * @returns {Promise<object>} Deletion response
 */
export const deleteFromUploadcare = async (uuid) => {
  console.warn('⚠️ Deletion must be implemented on your backend using Uploadcare secret key.');
  return {
    success: false,
    message: 'Client-side deletion not supported. Use backend API for secure deletion.',
  };
};

/**
 * Send evidence data to backend API
 * @param {string} fileUrl - The URL of the uploaded file
 * @param {string} projectId - The ID of the project/task
 * @returns {Promise<object>} API response
 */
export const postEvidenceToBackend = async (fileUrl, projectId) => {
  try {
    const response = await fetch('https://eight-csdo.onrender.com/api/evidence/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_url: fileUrl,
        project_id: projectId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Evidence posted successfully:', data);
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error posting evidence to backend:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Generate transformed image URL
 * @param {string} uuid - Uploadcare file UUID
 * @param {object} transformations - Resize, crop, quality, format
 * @returns {string} Transformed URL
 */
export const getTransformedUrl = (uuid, transformations = {}) => {
  const { width, height, quality = 'smart', format = 'auto' } = transformations;

  let transformStr = '';
  if (width || height) {
    transformStr += `/resize/${width || ''}x${height || ''}/`;
  }
  if (quality) transformStr += `/quality/${quality}/`;
  if (format && format !== 'auto') transformStr += `/format/${format}/`;

  return `${uploadcareConfig.baseCdnUrl}/${uuid}${transformStr}`;
};

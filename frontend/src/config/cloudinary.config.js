// ============================================================================
// CLOUDINARY CONFIGURATION
// ============================================================================
// 
// SETUP INSTRUCTIONS:
// 1. Login to Cloudinary: https://console.cloudinary.com/
// 2. Get your Cloud Name from the Dashboard
// 3. Create an UNSIGNED Upload Preset:
//    - Go to Settings → Upload → Upload presets
//    - Click "Add upload preset"
//    - Set "Signing Mode" to "Unsigned" (IMPORTANT!)
//    - Set folder, tags, or other settings as needed
//    - Save and copy the preset name
// 4. Replace the values below with your actual credentials
//
// CURRENT STATUS:
// ✓ Cloud Name: dicicd9ur (configured)
// ⚠ Upload Preset: DPRs (MUST be set to "Unsigned" in Cloudinary Dashboard)
//

export const cloudinaryConfig = {
  cloudName: 'dicicd9ur',        // Your cloud name (already configured)
  uploadPreset: 'fieldDPRs',          // Your upload preset (ENSURE it's set to UNSIGNED!)
  apiKey: '444414198449757',     // API key (not needed for unsigned uploads)
  apiSecret: 'Qrs2bs5lv9yKCd85xbnaWUCATks', // API secret (keep secure, not used in frontend)
};

// Upload settings
export const uploadSettings = {
  maxFileSize: 10485760, // 10MB in bytes
  allowedFormats: {
    dpr: ['pdf', 'xlsx', 'xls', 'ppt', 'pptx', 'doc', 'docx'],
    evidence: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'webm'],
    documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
  },
  folder: {
    dpr: 'field-worker/dpr',
    evidence: 'field-worker/evidence',
    documents: 'field-worker/documents',
  },
};

// Resource types for different upload categories
export const resourceTypes = {
  image: 'image',
  video: 'video',
  raw: 'raw', // For PDFs, documents, etc.
  auto: 'auto', // Cloudinary auto-detects
};

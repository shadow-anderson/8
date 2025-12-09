
export const uploadcareConfig = {
  publicKey: '857c1c20ff82bf08edeb', // e.g., 'demopublickey'
  baseCdnUrl: 'https://4ggp7sdvnb.ucarecd.net', // Your Uploadcare CDN URL (changed from ucarecdn.com)
  allowedFileTypes: {
    documents: ['pdf', 'docx', 'txt'],
    images: ['jpg', 'jpeg', 'png', 'webp'],
    videos: ['mp4', 'mov', 'avi'],
  },
  maxFileSize: 25 * 1024 * 1024, // 25MB
};

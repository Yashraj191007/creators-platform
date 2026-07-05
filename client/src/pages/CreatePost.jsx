import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import api from '../services/api';

const CreatePost = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async (formData) => {
    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      const response = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(response.data.url);
      setUploadSuccess(true);
    } catch (error) {
      setUploadError(
        error.response?.data?.message || 'Upload failed. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Create Post</h1>
      <ImageUpload onUpload={handleUpload} />
      {uploading && <p>Uploading...</p>}
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
      {uploadSuccess && (
        <div>
          <p style={{ color: 'green' }}>✅ Image uploaded successfully!</p>
          <img src={imageUrl} alt="Uploaded" style={{ width: '200px', marginTop: '8px' }} />
        </div>
      )}
      {/* rest of your form */}
    </div>
  );
};

export default CreatePost;

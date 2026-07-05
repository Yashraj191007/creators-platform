import React, { useState, useEffect } from 'react';

const ImageUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please select an image file (JPEG, PNG, WebP, or GIF)';
    }

    if (file.size > maxSizeInBytes) {
      return `File is too large. Maximum size is 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
    }

    return null; // null means no error
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // If user cancels the picker without selecting, files[0] will be undefined
    if (!file) return;

    // Clear previous errors
    setError('');

    // Validate the file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Set the file and generate a preview
    setSelectedFile(file);

    // Revoke previous preview URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  useEffect(() => {
    // This runs when previewUrl changes or the component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleUploadClick = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    // Create FormData and append the file
    const formData = new FormData();
    formData.append('image', selectedFile); // 'image' must match upload.single('image') on the backend

    // Pass formData up to the parent component via the onUpload prop
    if (onUpload) {
      onUpload(formData);
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={styles.fileInput}
      />
      {error && (
        <p style={{ color: '#fca5a5', fontSize: '0.85rem', margin: '0.5rem 0' }}>
          {error}
        </p>
      )}
      {previewUrl && (
        <div style={styles.previewContainer}>
          <p style={styles.previewText}>Preview:</p>
          <img
            src={previewUrl}
            alt="Selected file preview"
            style={styles.previewImage}
          />
        </div>
      )}
      <button
        type="button"
        onClick={handleUploadClick}
        disabled={!selectedFile || !!error}
        style={styles.button}
      >
        Upload Image
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  fileInput: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.85rem',
  },
  previewContainer: {
    marginTop: '0.5rem',
  },
  previewText: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.4)',
    margin: '0 0 0.5rem',
  },
  previewImage: {
    width: '200px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  button: {
    alignSelf: 'flex-start',
    padding: '0.5rem 1rem',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default ImageUpload;

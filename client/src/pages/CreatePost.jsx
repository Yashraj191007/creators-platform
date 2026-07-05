import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';
import api from '../services/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverImagePublicId, setCoverImagePublicId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleUpload = async (formData) => {
    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      const response = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCoverImage(response.data.url);
      setCoverImagePublicId(response.data.publicId);
      setUploadSuccess(true);
    } catch (error) {
      setUploadError(
        error.response?.data?.message || 'Upload failed. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setSubmitError('Title and content are required');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await api.post('/api/posts', {
        title,
        content,
        coverImage: coverImage || null,
        coverImagePublicId: coverImagePublicId || null,
      });
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || 'Failed to create post. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.inner}>
        <div style={styles.header}>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            ← Back to Dashboard
          </button>
        </div>

        <div style={styles.card}>
          <h1 style={styles.title}>Create New Post</h1>
          <p style={styles.subtitle}>Share your thoughts, stories, or announcements with your audience.</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title</label>
              <input
                type="text"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Content</label>
              <textarea
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={styles.textarea}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Cover Image (Optional)</label>
              <ImageUpload onUpload={handleUpload} />
              {uploading && <p style={styles.statusText}>Uploading image...</p>}
              {uploadError && <p style={styles.errorText}>⚠️ {uploadError}</p>}
              {uploadSuccess && (
                <div style={styles.successContainer}>
                  <p style={styles.successText}>✅ Image uploaded successfully!</p>
                  <img src={coverImage} alt="Uploaded Preview" style={styles.previewImage} />
                </div>
              )}
            </div>

            {submitError && <p style={styles.errorText}>⚠️ {submitError}</p>}

            <button
              type="submit"
              disabled={submitting || uploading}
              style={styles.submitBtn}
            >
              {submitting ? 'Creating Post...' : 'Publish Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    position: 'relative',
    overflow: 'hidden',
    color: '#fff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  blob1: {
    position: 'fixed', top: '-12rem', left: '-8rem',
    width: '40rem', height: '40rem', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'fixed', bottom: '-10rem', right: '-6rem',
    width: '35rem', height: '35rem', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  inner: {
    position: 'relative', zIndex: 1,
    maxWidth: '700px', margin: '0 auto',
    padding: '2rem 1.5rem 4rem',
  },
  header: {
    marginBottom: '1.5rem',
  },
  backBtn: {
    padding: '0.5rem 1rem',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#a5b4fc',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem',
    transition: 'background 0.2s',
  },
  card: {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    margin: '0 0 0.5rem',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.95rem',
    margin: '0 0 2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
  },
  textarea: {
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    minHeight: '150px',
    resize: 'vertical',
  },
  statusText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.85rem',
    margin: '0.25rem 0 0',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: '0.85rem',
    margin: '0.25rem 0 0',
  },
  successContainer: {
    marginTop: '0.5rem',
  },
  successText: {
    color: '#6ee7b7',
    fontSize: '0.85rem',
    margin: '0 0 0.5rem',
  },
  previewImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  submitBtn: {
    marginTop: '1rem',
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
};

export default CreatePost;

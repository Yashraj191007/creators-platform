import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload';

// Simple toast notification (no external library required)
const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const show = (message, type = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    };
    return { toasts, show };
};

const CreatePost = () => {
    const navigate = useNavigate();
    const { toasts, show: showToast } = useToast();

    // Form fields
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // Upload state
    const [pendingFormData, setPendingFormData] = useState(null); // FormData from ImageUpload
    const [coverImageUrl, setCoverImageUrl] = useState(null);
    const [coverImagePublicId, setCoverImagePublicId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Post creation state
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // ── Step 1: upload image to Cloudinary via /api/upload ──────────────────────
    // Called by ImageUpload when a valid file is selected.
    // We store the FormData now and upload it when the user clicks "Upload Image".
    const handleImageSelected = (formData) => {
        setPendingFormData(formData);
        setCoverImageUrl(null);
        setCoverImagePublicId(null);
        setUploadSuccess(false);
        setUploadError('');
    };

    const handleImageCleared = () => {
        setPendingFormData(null);
        setCoverImageUrl(null);
        setCoverImagePublicId(null);
        setUploadSuccess(false);
        setUploadError('');
    };

    const handleUpload = async () => {
        if (!pendingFormData) return;

        setUploading(true);
        setUploadError('');

        try {
            // Do NOT set Content-Type — the browser handles multipart/form-data boundary
            const response = await api.post('/api/upload', pendingFormData);

            // Store the Cloudinary secure_url returned by the backend
            setCoverImageUrl(response.data.url);
            setCoverImagePublicId(response.data.publicId);
            setUploadSuccess(true);
            showToast('✅ Image uploaded to Cloudinary!', 'success');
        } catch (err) {
            const msg = err.response?.data?.message || 'Upload failed. Please try again.';
            setUploadError(msg);
            showToast(`❌ Upload failed: ${msg}`, 'error');
        } finally {
            // Always turn off the spinner — regardless of success or error
            setUploading(false);
        }
    };

    // ── Step 2: create the post with (or without) the image URL ─────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!title.trim() || !content.trim()) {
            setSubmitError('Title and content are required.');
            return;
        }

        // If the user selected an image but hasn't clicked "Upload" yet, prompt them
        if (pendingFormData && !uploadSuccess) {
            setSubmitError('Please click "Upload Image" before creating the post.');
            return;
        }

        setSubmitting(true);

        try {
            await api.post('/api/posts', {
                title: title.trim(),
                content: content.trim(),
                // Include the Cloudinary URL (or null for text-only posts)
                coverImage: coverImageUrl,
                coverImagePublicId: coverImagePublicId,
            });

            showToast('🎉 Post created successfully!', 'success');

            // Brief pause so the toast is visible, then navigate
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create post. Please try again.';
            setSubmitError(msg);
            showToast(`❌ ${msg}`, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            {/* Toast container */}
            <div style={styles.toastContainer}>
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        style={{
                            ...styles.toast,
                            ...(t.type === 'error' ? styles.toastError : styles.toastSuccess),
                        }}
                    >
                        {t.message}
                    </div>
                ))}
            </div>

            <div style={styles.inner}>
                {/* Header */}
                <header style={styles.topBar}>
                    <div style={styles.topBarLeft}>
                        <span style={styles.logoMark}>✦</span>
                        <span style={styles.platformName}>Creators Platform</span>
                    </div>
                    <Link to="/dashboard" style={styles.backLink}>
                        ← Back to Dashboard
                    </Link>
                </header>

                {/* Page title */}
                <div style={styles.titleSection}>
                    <h1 style={styles.heading}>Create a New Post</h1>
                    <p style={styles.subHeading}>
                        Optionally add a cover image, then fill in your title and content.
                    </p>
                </div>

                {/* Form card */}
                <div style={styles.card}>
                    <form onSubmit={handleSubmit} style={styles.form}>

                        {/* ── Cover Image Section ── */}
                        <div style={styles.section}>
                            <label style={styles.sectionLabel}>
                                <span style={styles.labelIcon}>🖼️</span> Cover Image{' '}
                                <span style={styles.optional}>(optional)</span>
                            </label>

                            <ImageUpload
                                onUpload={handleImageSelected}
                                onClear={handleImageCleared}
                                disabled={uploading || submitting}
                            />

                            {/* Upload button — only shown when an image has been selected but not yet uploaded */}
                            {pendingFormData && !uploadSuccess && (
                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    style={{
                                        ...styles.uploadBtn,
                                        ...(uploading ? styles.btnDisabled : {}),
                                    }}
                                >
                                    {uploading ? (
                                        <><span style={styles.spinner} /> Uploading…</>
                                    ) : (
                                        '☁️ Upload Image'
                                    )}
                                </button>
                            )}

                            {/* Upload success badge */}
                            {uploadSuccess && (
                                <div style={styles.successBadge}>
                                    ✅ Image uploaded to Cloudinary
                                </div>
                            )}

                            {/* Upload error (inline, in addition to toast) */}
                            {uploadError && (
                                <p style={styles.errorText}>⚠️ {uploadError}</p>
                            )}
                        </div>

                        {/* ── Title ── */}
                        <div style={styles.section}>
                            <label htmlFor="post-title" style={styles.sectionLabel}>
                                <span style={styles.labelIcon}>📝</span> Title
                            </label>
                            <input
                                id="post-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Give your post a title…"
                                maxLength={150}
                                disabled={submitting}
                                style={styles.input}
                            />
                        </div>

                        {/* ── Content ── */}
                        <div style={styles.section}>
                            <label htmlFor="post-content" style={styles.sectionLabel}>
                                <span style={styles.labelIcon}>✍️</span> Content
                            </label>
                            <textarea
                                id="post-content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your post content here…"
                                rows={7}
                                disabled={submitting}
                                style={styles.textarea}
                            />
                        </div>

                        {/* Submit error */}
                        {submitError && (
                            <p style={styles.errorText}>⚠️ {submitError}</p>
                        )}

                        {/* Actions */}
                        <div style={styles.actions}>
                            <Link to="/dashboard" style={styles.cancelBtn}>
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting || uploading}
                                style={{
                                    ...styles.submitBtn,
                                    ...((submitting || uploading) ? styles.btnDisabled : {}),
                                }}
                            >
                                {submitting ? (
                                    <><span style={styles.spinner} /> Creating…</>
                                ) : (
                                    '🚀 Create Post'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        position: 'relative',
        overflow: 'hidden',
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
        padding: '1.5rem 1.5rem 3rem',
    },
    topBar: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.5rem',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '2rem',
    },
    topBarLeft: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
    logoMark: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '32px', height: '32px', borderRadius: '8px',
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        fontSize: '0.9rem', color: '#fff',
    },
    platformName: { color: '#fff', fontWeight: '700', fontSize: '1rem' },
    backLink: {
        color: '#a5b4fc', fontSize: '0.875rem', fontWeight: '500',
        textDecoration: 'none',
    },
    titleSection: { marginBottom: '1.75rem' },
    heading: {
        fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800',
        color: '#fff', letterSpacing: '-0.02em', margin: '0 0 0.35rem',
    },
    subHeading: { color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 },
    card: {
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
        padding: '2rem',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    section: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
    sectionLabel: {
        color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem',
        fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem',
    },
    labelIcon: { fontSize: '1rem' },
    optional: { color: 'rgba(255,255,255,0.35)', fontWeight: '400' },
    input: {
        width: '100%', padding: '0.8rem 1rem',
        background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px', color: '#fff', fontSize: '0.95rem',
        outline: 'none', boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    textarea: {
        width: '100%', padding: '0.8rem 1rem',
        background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px', color: '#fff', fontSize: '0.95rem',
        outline: 'none', resize: 'vertical', boxSizing: 'border-box',
        fontFamily: 'inherit', lineHeight: 1.6,
        transition: 'border-color 0.2s',
    },
    uploadBtn: {
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.65rem 1.4rem',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        border: 'none', borderRadius: '10px',
        color: '#fff', fontWeight: '700', fontSize: '0.9rem',
        cursor: 'pointer', width: 'fit-content',
        transition: 'opacity 0.2s',
    },
    submitBtn: {
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.75rem 2rem',
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        border: 'none', borderRadius: '12px',
        color: '#fff', fontWeight: '800', fontSize: '1rem',
        cursor: 'pointer', flex: 1, justifyContent: 'center',
        transition: 'opacity 0.2s',
    },
    cancelBtn: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '0.75rem 1.5rem',
        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '12px', color: 'rgba(255,255,255,0.65)',
        fontWeight: '600', fontSize: '0.95rem', textDecoration: 'none',
        transition: 'background 0.2s',
    },
    btnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
    actions: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
    successBadge: {
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.45rem 0.9rem',
        background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
        borderRadius: '8px', color: '#6ee7b7', fontSize: '0.82rem', fontWeight: '600',
    },
    errorText: {
        color: '#fca5a5', fontSize: '0.82rem', margin: 0,
        padding: '0.5rem 0.75rem',
        background: 'rgba(239,68,68,0.1)', borderRadius: '8px',
        border: '1px solid rgba(239,68,68,0.2)',
    },
    spinner: {
        display: 'inline-block',
        width: '14px', height: '14px',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTopColor: '#fff', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
    },
    // Toast styles
    toastContainer: {
        position: 'fixed', top: '1.2rem', right: '1.2rem',
        zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.6rem',
        maxWidth: '340px',
    },
    toast: {
        padding: '0.85rem 1.2rem',
        borderRadius: '12px',
        fontSize: '0.875rem', fontWeight: '600',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid',
        animation: 'fadeIn 0.25s ease',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
    },
    toastSuccess: {
        background: 'rgba(16,185,129,0.2)',
        borderColor: 'rgba(16,185,129,0.4)',
        color: '#6ee7b7',
    },
    toastError: {
        background: 'rgba(239,68,68,0.2)',
        borderColor: 'rgba(239,68,68,0.4)',
        color: '#fca5a5',
    },
};

// Inject keyframes for spinner & toast animations
if (typeof document !== 'undefined' && !document.getElementById('create-post-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'create-post-styles';
    styleEl.textContent = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        #post-title:focus, #post-content:focus {
            border-color: rgba(99,102,241,0.6) !important;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }
    `;
    document.head.appendChild(styleEl);
}

export default CreatePost;

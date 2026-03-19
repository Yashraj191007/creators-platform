import { useState, useEffect, useRef } from 'react';

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * ImageUpload
 *
 * Props:
 *   onUpload(formData)  — called with a FormData object when a valid file is chosen
 *   onClear()           — called when the user removes the selected image
 *   disabled            — disables the control (e.g. while uploading)
 */
const ImageUpload = ({ onUpload, onClear, disabled = false }) => {
    const [preview, setPreview] = useState(null);  // blob URL for <img>
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);
    const blobUrlRef = useRef(null);  // track current blob URL for cleanup

    // Clean up the blob URL when the component unmounts or preview changes
    useEffect(() => {
        return () => {
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
            }
        };
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError('');

        // --- Client-side validation ---
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError('Only JPEG, PNG, GIF, or WebP images are allowed.');
            e.target.value = '';
            return;
        }

        if (file.size > MAX_SIZE_BYTES) {
            setError(`File is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
            e.target.value = '';
            return;
        }

        // Revoke the old blob URL before creating a new one
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
        }

        const blobUrl = URL.createObjectURL(file);
        blobUrlRef.current = blobUrl;
        setPreview(blobUrl);
        setFileName(file.name);

        // Build FormData and pass it to the parent
        const formData = new FormData();
        formData.append('image', file);
        onUpload(formData);
    };

    const handleClear = () => {
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
        setPreview(null);
        setFileName('');
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (onClear) onClear();
    };

    return (
        <div style={styles.wrapper}>
            {/* Drop zone / click to browse */}
            {!preview && (
                <label
                    style={{
                        ...styles.dropZone,
                        ...(disabled ? styles.disabled : {}),
                    }}
                    htmlFor="image-upload-input"
                >
                    <span style={styles.uploadIcon}>🖼️</span>
                    <span style={styles.dropText}>Click to choose a cover image</span>
                    <span style={styles.dropSub}>JPEG, PNG, GIF or WebP · Max {MAX_SIZE_MB} MB</span>
                    <input
                        id="image-upload-input"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={disabled}
                        style={{ display: 'none' }}
                    />
                </label>
            )}

            {/* Preview */}
            {preview && (
                <div style={styles.previewWrapper}>
                    <img src={preview} alt="Cover preview" style={styles.previewImg} />
                    <div style={styles.previewMeta}>
                        <span style={styles.fileName}>📎 {fileName}</span>
                        {!disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                style={styles.clearBtn}
                                title="Remove image"
                            >
                                ✕ Remove
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Validation error */}
            {error && <p style={styles.error}>⚠️ {error}</p>}
        </div>
    );
};

const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    dropZone: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        padding: '2rem 1.5rem',
        border: '2px dashed rgba(99,102,241,0.45)',
        borderRadius: '14px',
        background: 'rgba(99,102,241,0.06)',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
        textAlign: 'center',
    },
    disabled: { opacity: 0.5, cursor: 'not-allowed' },
    uploadIcon: { fontSize: '2rem' },
    dropText: { color: '#c7d2fe', fontWeight: '600', fontSize: '0.9rem' },
    dropSub: { color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' },
    previewWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
    },
    previewImg: {
        width: '100%',
        maxHeight: '220px',
        objectFit: 'cover',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    previewMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
    },
    fileName: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: '0.78rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flex: 1,
    },
    clearBtn: {
        padding: '0.3rem 0.75rem',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: '8px',
        color: '#fca5a5',
        cursor: 'pointer',
        fontSize: '0.78rem',
        fontWeight: '600',
        flexShrink: 0,
    },
    error: {
        color: '#fca5a5',
        fontSize: '0.82rem',
        margin: 0,
        padding: '0.5rem 0.75rem',
        background: 'rgba(239,68,68,0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(239,68,68,0.2)',
    },
};

export default ImageUpload;

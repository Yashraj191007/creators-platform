import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const CreatePost = () => {
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        else if (formData.title.trim().length > 150) newErrors.title = 'Title cannot exceed 150 characters';
        if (!formData.content.trim()) newErrors.content = 'Content is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        try {
            await api.post('/api/posts', {
                title: formData.title.trim(),
                content: formData.content.trim(),
            });
            toast.success('Post created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const charCount = formData.content.length;

    return (
        <div style={styles.page}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={styles.wrapper}>
                {/* Header */}
                <div style={styles.topBar}>
                    <Link to="/dashboard" style={styles.backLink}>
                        ← Back to Dashboard
                    </Link>
                    <div style={styles.topBarBrand}>
                        <span style={styles.logoMark}>✦</span>
                        <span style={styles.platformName}>Creators Platform</span>
                    </div>
                </div>

                {/* Card */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div style={styles.iconWrap}>✍️</div>
                        <div>
                            <h1 style={styles.title}>Create a Post</h1>
                            <p style={styles.subtitle}>Share your ideas with the community</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form} noValidate>
                        {/* Title */}
                        <div style={styles.field}>
                            <label htmlFor="title" style={styles.label}>Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Give your post a compelling title…"
                                style={errors.title ? { ...styles.input, ...styles.inputError } : styles.input}
                                disabled={isLoading}
                                maxLength={150}
                            />
                            <div style={styles.fieldMeta}>
                                {errors.title
                                    ? <span style={styles.errorText}>{errors.title}</span>
                                    : <span />}
                                <span style={styles.charHint}>{formData.title.length}/150</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div style={styles.field}>
                            <label htmlFor="content" style={styles.label}>Content</label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Write your post content here…"
                                rows={10}
                                style={errors.content ? { ...styles.textarea, ...styles.inputError } : styles.textarea}
                                disabled={isLoading}
                            />
                            <div style={styles.fieldMeta}>
                                {errors.content
                                    ? <span style={styles.errorText}>{errors.content}</span>
                                    : <span />}
                                <span style={styles.charHint}>{charCount} chars</span>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            style={isLoading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? <span style={styles.btnContent}><span style={styles.spinner} /> Publishing…</span>
                                : '✦ Publish Post'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// ---------- Styles ----------
const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        position: 'relative', overflow: 'hidden',
        padding: '2rem 1rem',
        boxSizing: 'border-box',
    },
    blob1: {
        position: 'fixed', top: '-10rem', right: '-8rem',
        width: '36rem', height: '36rem', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'fixed', bottom: '-8rem', left: '-6rem',
        width: '30rem', height: '30rem', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.17) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    wrapper: {
        position: 'relative', zIndex: 1,
        maxWidth: '720px', margin: '0 auto',
    },
    topBar: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.5rem',
    },
    backLink: {
        color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
        fontSize: '0.875rem', fontWeight: '500',
        transition: 'color 0.2s',
    },
    topBarBrand: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    logoMark: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '28px', height: '28px', borderRadius: '7px',
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        fontSize: '0.8rem', color: '#fff',
    },
    platformName: { color: '#fff', fontWeight: '700', fontSize: '0.95rem' },
    card: {
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)',
        padding: '2rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
    },
    cardHeader: {
        display: 'flex', alignItems: 'center', gap: '1rem',
        marginBottom: '1.75rem',
    },
    iconWrap: {
        fontSize: '2rem', flexShrink: 0,
        width: '52px', height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(99,102,241,0.15)', borderRadius: '14px',
        border: '1px solid rgba(99,102,241,0.25)',
    },
    title: { fontSize: '1.4rem', fontWeight: '800', color: '#fff', margin: '0 0 0.2rem' },
    subtitle: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', margin: 0 },
    errorBanner: {
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.85rem 1rem', marginBottom: '1.25rem',
        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)',
        borderRadius: '10px', color: '#fca5a5', fontSize: '0.9rem',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
    label: {
        fontSize: '0.8rem', fontWeight: '600',
        color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em', textTransform: 'uppercase',
    },
    input: {
        padding: '0.8rem 1rem', fontSize: '0.95rem',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '10px', color: '#fff',
        outline: 'none', width: '100%', boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    textarea: {
        padding: '0.8rem 1rem', fontSize: '0.95rem',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '10px', color: '#fff',
        outline: 'none', width: '100%', boxSizing: 'border-box',
        resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7,
        transition: 'border-color 0.2s',
    },
    inputError: {
        borderColor: 'rgba(239,68,68,0.7)',
        boxShadow: '0 0 0 3px rgba(239,68,68,0.12)',
    },
    fieldMeta: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    errorText: { fontSize: '0.78rem', color: '#fca5a5', fontWeight: '500' },
    charHint: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' },
    btn: {
        marginTop: '0.5rem', padding: '0.9rem', fontSize: '1rem', fontWeight: '700',
        color: '#fff', background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        border: 'none', borderRadius: '12px', cursor: 'pointer',
        letterSpacing: '0.02em', boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
        transition: 'opacity 0.2s, transform 0.15s',
    },
    btnDisabled: {
        background: 'rgba(255,255,255,0.1)', cursor: 'not-allowed', boxShadow: 'none',
    },
    btnContent: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    },
    spinner: {
        display: 'inline-block', width: '16px', height: '16px',
        border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
        borderRadius: '50%', animation: 'spin 0.7s linear infinite',
    },
};

export default CreatePost;

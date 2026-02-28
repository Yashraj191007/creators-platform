import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ---------- JWT helper ----------
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp < Date.now() / 1000;
    } catch {
        return true;
    }
};

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Input handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
        if (apiError) setApiError('');
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Validate token before storing
                if (isTokenExpired(data.token)) {
                    setApiError('Received an invalid token. Please try again.');
                    return;
                }
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setFormData({ email: '', password: '' });
                navigate('/dashboard');
            } else {
                setApiError(data.message || 'Login failed. Please try again.');
            }
        } catch {
            setApiError('Unable to connect to server. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.logoCircle}>✦</div>
                    <h1 style={styles.title}>Welcome Back</h1>
                    <p style={styles.subtitle}>Sign in to your Creators Platform account</p>
                </div>

                {/* API Error */}
                {apiError && (
                    <div style={styles.errorBanner}>
                        <span>⚠️</span> {apiError}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form} noValidate>

                    {/* Email */}
                    <div style={styles.field}>
                        <label htmlFor="email" style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            style={errors.email ? { ...styles.input, ...styles.inputError } : styles.input}
                            disabled={isLoading}
                            autoComplete="email"
                        />
                        {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                    </div>

                    {/* Password */}
                    <div style={styles.field}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <div style={styles.inputWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                style={errors.password
                                    ? { ...styles.input, ...styles.inputWithBtn, ...styles.inputError }
                                    : { ...styles.input, ...styles.inputWithBtn }}
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                style={styles.eyeBtn}
                                tabIndex={-1}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {errors.password && <span style={styles.errorText}>{errors.password}</span>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        style={isLoading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? <span style={styles.btnContent}><span style={styles.spinner} /> Signing in...</span>
                            : 'Sign In ✦'
                        }
                    </button>
                </form>

                {/* Footer */}
                <p style={styles.footerText}>
                    Don&apos;t have an account?{' '}
                    <Link to="/register" style={styles.footerLink}>Sign up here</Link>
                </p>
            </div>
        </div>
    );
};

// ---------- Styles ----------
const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        position: 'relative',
        overflow: 'hidden',
    },
    blob1: {
        position: 'absolute', top: '-10rem', right: '-10rem',
        width: '35rem', height: '35rem', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute', bottom: '-8rem', left: '-8rem',
        width: '30rem', height: '30rem', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    card: {
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '420px',
        padding: '2.5rem',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
    },
    header: { textAlign: 'center', marginBottom: '2rem' },
    logoCircle: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '52px', height: '52px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        fontSize: '1.4rem', color: '#fff', marginBottom: '1rem',
        boxShadow: '0 0 20px rgba(99,102,241,0.5)',
    },
    title: {
        fontSize: '1.75rem', fontWeight: '700', color: '#fff',
        margin: '0 0 0.4rem', letterSpacing: '-0.02em',
    },
    subtitle: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', margin: 0 },
    errorBanner: {
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.875rem 1rem',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.35)',
        borderRadius: '10px', color: '#fca5a5',
        fontSize: '0.9rem', marginBottom: '1.25rem',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
    label: {
        fontSize: '0.82rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)',
        letterSpacing: '0.03em', textTransform: 'uppercase',
    },
    input: {
        padding: '0.75rem 1rem', fontSize: '0.95rem',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '10px', color: '#fff',
        outline: 'none', width: '100%', boxSizing: 'border-box',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    inputWithBtn: { paddingRight: '3rem' },
    inputError: {
        borderColor: 'rgba(239,68,68,0.7)',
        boxShadow: '0 0 0 3px rgba(239,68,68,0.15)',
    },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    eyeBtn: {
        position: 'absolute', right: '0.75rem',
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: '1rem', color: 'rgba(255,255,255,0.5)', padding: '0.25rem', lineHeight: 1,
    },
    errorText: { fontSize: '0.78rem', color: '#fca5a5', fontWeight: '500' },
    btn: {
        marginTop: '0.5rem', padding: '0.875rem', fontSize: '1rem', fontWeight: '700',
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
    footerText: {
        textAlign: 'center', marginTop: '1.5rem',
        fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)',
    },
    footerLink: { color: '#818cf8', fontWeight: '600', textDecoration: 'none' },
};

export default Login;

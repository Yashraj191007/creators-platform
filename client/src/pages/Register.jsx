import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  // Form field states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // UI states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const navigate = useNavigate();

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (password.length === 0) return null;
    if (password.length < 6) return 'weak';
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const score = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (password.length >= 10 && score >= 3) return 'strong';
    if (password.length >= 8 && score >= 2) return 'medium';
    return 'weak';
  };

  // Email availability check with debounce
  useEffect(() => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailAvailable(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users?email=${encodeURIComponent(formData.email)}`);
        const data = await res.json();
        const exists = Array.isArray(data) && data.some(
          (u) => u.email === formData.email.toLowerCase()
        );
        setEmailAvailable(!exists);
      } catch {
        setEmailAvailable(null);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [formData.email]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms & Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage('');
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('🎉 Account created! Redirecting to login...');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setAgreedToTerms(false);
        setPasswordStrength(null);
        setEmailAvailable(null);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setApiError(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setApiError('Unable to connect to server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const strengthConfig = {
    weak: { label: 'Weak', color: '#ef4444', width: '33%' },
    medium: { label: 'Fair', color: '#f59e0b', width: '66%' },
    strong: { label: 'Strong', color: '#10b981', width: '100%' },
  };

  return (
    <div style={styles.page}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoCircle}>✦</div>
          <h1 style={styles.title}>Join Creators Platform</h1>
          <p style={styles.subtitle}>Start building your creative journey today</p>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div style={styles.successBanner}>
            <span style={styles.bannerIcon}>✅</span>
            {successMessage}
          </div>
        )}

        {/* Error Banner */}
        {apiError && (
          <div style={styles.errorBanner}>
            <span style={styles.bannerIcon}>⚠️</span>
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form} noValidate>

          {/* Name */}
          <div style={styles.field}>
            <label htmlFor="name" style={styles.label}>Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={errors.name ? { ...styles.input, ...styles.inputError } : styles.input}
              disabled={isLoading}
              autoComplete="name"
            />
            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>
              Email Address
              {emailAvailable === true && <span style={styles.availableTag}> ✓ Available</span>}
              {emailAvailable === false && <span style={styles.takenTag}> ✗ Already taken</span>}
            </label>
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
                placeholder="Min. 6 characters"
                style={errors.password ? { ...styles.input, ...styles.inputWithBtn, ...styles.inputError } : { ...styles.input, ...styles.inputWithBtn }}
                disabled={isLoading}
                autoComplete="new-password"
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
            {/* Password Strength Bar */}
            {passwordStrength && (
              <div style={styles.strengthContainer}>
                <div style={styles.strengthBarTrack}>
                  <div style={{
                    ...styles.strengthBarFill,
                    width: strengthConfig[passwordStrength].width,
                    backgroundColor: strengthConfig[passwordStrength].color,
                  }} />
                </div>
                <span style={{ ...styles.strengthLabel, color: strengthConfig[passwordStrength].color }}>
                  {strengthConfig[passwordStrength].label}
                </span>
              </div>
            )}
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div style={styles.field}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                style={errors.confirmPassword ? { ...styles.input, ...styles.inputWithBtn, ...styles.inputError } : { ...styles.input, ...styles.inputWithBtn }}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                style={styles.eyeBtn}
                tabIndex={-1}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {/* Match indicator */}
            {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
              <span style={styles.matchText}>✓ Passwords match</span>
            )}
            {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          {/* Terms */}
          <div style={styles.termsRow}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
                }}
                style={styles.checkbox}
                disabled={isLoading}
              />
              <span>
                I agree to the{' '}
                <span style={styles.termsLink}>Terms & Conditions</span>
              </span>
            </label>
            {errors.terms && <span style={styles.errorText}>{errors.terms}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={isLoading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={styles.btnContent}>
                <span style={styles.spinner} /> Creating Account...
              </span>
            ) : (
              'Create Account ✦'
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.footerLink}>
            Sign in here
          </Link>
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
    position: 'absolute',
    top: '-10rem',
    left: '-10rem',
    width: '35rem',
    height: '35rem',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    bottom: '-8rem',
    right: '-8rem',
    width: '30rem',
    height: '30rem',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '460px',
    padding: '2.5rem',
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logoCircle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
    fontSize: '1.4rem',
    color: '#fff',
    marginBottom: '1rem',
    boxShadow: '0 0 20px rgba(99,102,241,0.5)',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 0.4rem',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.55)',
    margin: 0,
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1rem',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.35)',
    borderRadius: '10px',
    color: '#6ee7b7',
    fontSize: '0.9rem',
    marginBottom: '1.25rem',
    animation: 'fadeIn 0.3s ease',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1rem',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    borderRadius: '10px',
    color: '#fca5a5',
    fontSize: '0.9rem',
    marginBottom: '1.25rem',
  },
  bannerIcon: {
    fontSize: '1rem',
    flexShrink: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  availableTag: {
    fontWeight: '600',
    color: '#10b981',
    textTransform: 'none',
    fontSize: '0.78rem',
  },
  takenTag: {
    fontWeight: '600',
    color: '#ef4444',
    textTransform: 'none',
    fontSize: '0.78rem',
  },
  input: {
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputWithBtn: {
    paddingRight: '3rem',
  },
  inputError: {
    borderColor: 'rgba(239, 68, 68, 0.7)',
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.15)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  eyeBtn: {
    position: 'absolute',
    right: '0.75rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.5)',
    padding: '0.25rem',
    lineHeight: 1,
  },
  strengthContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0.25rem',
  },
  strengthBarTrack: {
    flex: 1,
    height: '4px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.4s ease, background-color 0.4s ease',
  },
  strengthLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    minWidth: '3.5rem',
    textAlign: 'right',
  },
  matchText: {
    fontSize: '0.78rem',
    color: '#10b981',
    fontWeight: '500',
    marginTop: '0.1rem',
  },
  errorText: {
    fontSize: '0.78rem',
    color: '#fca5a5',
    fontWeight: '500',
  },
  termsRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    color: 'rgba(255,255,255,0.65)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#6366f1',
    cursor: 'pointer',
    flexShrink: 0,
  },
  termsLink: {
    color: '#818cf8',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btn: {
    marginTop: '0.5rem',
    padding: '0.875rem',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    letterSpacing: '0.02em',
    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
    transition: 'opacity 0.2s, transform 0.15s',
  },
  btnDisabled: {
    background: 'rgba(255,255,255,0.1)',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  btnContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.45)',
  },
  footerLink: {
    color: '#818cf8',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default Register;

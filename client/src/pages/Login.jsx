import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div style={styles.page}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoCircle}>✦</div>
                    <h1 style={styles.title}>Welcome Back</h1>
                    <p style={styles.subtitle}>Login functionality coming in the next lesson</p>
                </div>

                <div style={styles.comingSoon}>
                    <span style={styles.comingSoonIcon}>🚀</span>
                    <p style={styles.comingSoonText}>
                        Login with JWT authentication will be implemented in <strong>Lesson 3.3</strong>.
                    </p>
                </div>

                <p style={styles.footerText}>
                    Don&apos;t have an account?{' '}
                    <Link to="/register" style={styles.footerLink}>
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

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
        right: '-10rem',
        width: '35rem',
        height: '35rem',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute',
        bottom: '-8rem',
        left: '-8rem',
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
        maxWidth: '420px',
        padding: '2.5rem',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        textAlign: 'center',
    },
    header: {
        marginBottom: '1.75rem',
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
    comingSoon: {
        padding: '1.5rem',
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
    },
    comingSoonIcon: {
        fontSize: '2rem',
    },
    comingSoonText: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: '0.9rem',
        lineHeight: 1.6,
        margin: 0,
    },
    footerText: {
        fontSize: '0.875rem',
        color: 'rgba(255,255,255,0.45)',
        margin: 0,
    },
    footerLink: {
        color: '#818cf8',
        fontWeight: '600',
        textDecoration: 'none',
    },
};

export default Login;

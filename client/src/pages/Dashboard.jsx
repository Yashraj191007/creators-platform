import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ---------- JWT expiry helper ----------
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp < Date.now() / 1000;
    } catch {
        return true;
    }
};

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        // Redirect if not logged in or token expired
        if (!token || !userData || isTokenExpired(token)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            return;
        }

        try {
            setUser(JSON.parse(userData));
        } catch {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        return (
            <div style={styles.loadingPage}>
                <div style={styles.loadingSpinner} />
                <p style={styles.loadingText}>Loading your dashboard...</p>
            </div>
        );
    }

    // Decode JWT to show raw payload (for educational demo)
    const token = localStorage.getItem('token');
    let jwtPayload = null;
    try {
        jwtPayload = JSON.parse(atob(token.split('.')[1]));
    } catch {
        jwtPayload = null;
    }

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—';

    return (
        <div style={styles.page}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={styles.inner}>
                {/* Top bar */}
                <header style={styles.topBar}>
                    <div style={styles.topBarLeft}>
                        <span style={styles.logoMark}>✦</span>
                        <span style={styles.platformName}>Creators Platform</span>
                    </div>
                    <div style={styles.topBarRight}>
                        <span style={styles.userPill}>👤 {user.name}</span>
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            Logout
                        </button>
                    </div>
                </header>

                {/* Greeting */}
                <div style={styles.greetingSection}>
                    <h1 style={styles.greeting}>Welcome back, {user.name.split(' ')[0]}! 🎉</h1>
                    <p style={styles.greetingSub}>Here&apos;s your account overview and session info.</p>
                </div>

                {/* Cards grid */}
                <div style={styles.grid}>

                    {/* Profile card */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={styles.cardIcon}>👤</span>
                            <h2 style={styles.cardTitle}>Your Profile</h2>
                        </div>
                        <div style={styles.cardBody}>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Name</span>
                                <span style={styles.infoValue}>{user.name}</span>
                            </div>
                            <div style={styles.divider} />
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Email</span>
                                <span style={styles.infoValue}>{user.email}</span>
                            </div>
                            <div style={styles.divider} />
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Member Since</span>
                                <span style={styles.infoValue}>{memberSince}</span>
                            </div>
                        </div>
                    </div>

                    {/* JWT info card */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={styles.cardIcon}>🔐</span>
                            <h2 style={styles.cardTitle}>Session Token (JWT)</h2>
                        </div>
                        <div style={styles.cardBody}>
                            {jwtPayload && (
                                <>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>User ID</span>
                                        <span style={{ ...styles.infoValue, ...styles.mono }}>{jwtPayload.userId}</span>
                                    </div>
                                    <div style={styles.divider} />
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Issued At</span>
                                        <span style={styles.infoValue}>
                                            {new Date(jwtPayload.iat * 1000).toLocaleString()}
                                        </span>
                                    </div>
                                    <div style={styles.divider} />
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Expires At</span>
                                        <span style={{ ...styles.infoValue, color: '#10b981' }}>
                                            {new Date(jwtPayload.exp * 1000).toLocaleString()}
                                        </span>
                                    </div>
                                </>
                            )}
                            <div style={styles.tokenBox}>
                                <p style={styles.tokenLabel}>Raw token stored in localStorage:</p>
                                <code style={styles.tokenCode}>{token?.slice(0, 60)}...</code>
                            </div>
                        </div>
                    </div>

                    {/* Coming soon card */}
                    <div style={{ ...styles.card, ...styles.cardWide }}>
                        <div style={styles.cardHeader}>
                            <span style={styles.cardIcon}>🚀</span>
                            <h2 style={styles.cardTitle}>What&apos;s Coming</h2>
                        </div>
                        <div style={styles.featureGrid}>
                            {[
                                { icon: '✍️', title: 'Content Studio', desc: 'Create and publish your content' },
                                { icon: '📊', title: 'Analytics', desc: 'Track views, likes, and growth' },
                                { icon: '🎨', title: 'Profile Editor', desc: 'Customise your creator profile' },
                                { icon: '💬', title: 'Community', desc: 'Connect with other creators' },
                            ].map((f) => (
                                <div key={f.title} style={styles.featureItem}>
                                    <span style={styles.featureIcon}>{f.icon}</span>
                                    <div>
                                        <p style={styles.featureTitle}>{f.title}</p>
                                        <p style={styles.featureDesc}>{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// ---------- Styles ----------
const styles = {
    loadingPage: {
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: '1rem',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    },
    loadingSpinner: {
        width: '40px', height: '40px',
        border: '3px solid rgba(255,255,255,0.15)',
        borderTopColor: '#6366f1', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' },
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        position: 'relative', overflow: 'hidden',
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
        maxWidth: '1100px', margin: '0 auto',
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
    topBarRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    userPill: {
        padding: '0.35rem 0.9rem',
        background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '999px', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: '500',
    },
    logoutBtn: {
        padding: '0.45rem 1.1rem',
        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)',
        borderRadius: '8px', color: '#fca5a5', cursor: 'pointer',
        fontSize: '0.875rem', fontWeight: '600', transition: 'background 0.2s',
    },
    greetingSection: { marginBottom: '2rem' },
    greeting: {
        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: '800',
        color: '#fff', letterSpacing: '-0.02em', margin: '0 0 0.4rem',
    },
    greetingSub: { color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', margin: 0 },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem',
    },
    card: {
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
        padding: '1.5rem', overflow: 'hidden',
    },
    cardWide: { gridColumn: '1 / -1' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' },
    cardIcon: { fontSize: '1.3rem' },
    cardTitle: { fontSize: '1rem', fontWeight: '700', color: '#fff', margin: 0 },
    cardBody: {},
    infoRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.6rem 0',
    },
    infoLabel: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' },
    infoValue: { fontSize: '0.9rem', color: '#fff', fontWeight: '500', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' },
    mono: { fontFamily: 'monospace', fontSize: '0.78rem' },
    divider: { height: '1px', background: 'rgba(255,255,255,0.06)' },
    tokenBox: {
        marginTop: '1rem', padding: '0.875rem',
        background: 'rgba(0,0,0,0.25)', borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.08)',
    },
    tokenLabel: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 0.5rem' },
    tokenCode: {
        fontSize: '0.72rem', color: '#a5b4fc',
        wordBreak: 'break-all', lineHeight: 1.6,
        fontFamily: 'monospace',
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
    },
    featureItem: {
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        padding: '1rem', background: 'rgba(255,255,255,0.04)',
        borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)',
    },
    featureIcon: { fontSize: '1.4rem', flexShrink: 0 },
    featureTitle: { color: '#fff', fontWeight: '600', fontSize: '0.9rem', margin: '0 0 0.2rem' },
    featureDesc: { color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', margin: 0 },
};

export default Dashboard;

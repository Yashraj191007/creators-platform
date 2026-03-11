import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={styles.page}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={styles.content}>
                <div style={styles.logoCircle}>✦</div>
                <h1 style={styles.title}>Creators Platform</h1>
                <p style={styles.subtitle}>
                    Your space to create, share, and grow. Join thousands of creators
                    building their audience.
                </p>

                <div style={styles.actions}>
                    <Link to="/register" style={styles.btnPrimary}>
                        Get Started →
                    </Link>
                    <Link to="/login" style={styles.btnSecondary}>
                        Sign In
                    </Link>
                </div>

                <div style={styles.features}>
                    {[
                        { icon: '✍️', title: 'Create', desc: 'Publish your content' },
                        { icon: '📊', title: 'Analyse', desc: 'Track your growth' },
                        { icon: '🌐', title: 'Share', desc: 'Reach your audience' },
                    ].map((f) => (
                        <div key={f.title} style={styles.featureCard}>
                            <span style={styles.featureIcon}>{f.icon}</span>
                            <p style={styles.featureTitle}>{f.title}</p>
                            <p style={styles.featureDesc}>{f.desc}</p>
                        </div>
                    ))}
                </div>
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
        position: 'absolute', top: '-10rem', right: '-8rem',
        width: '38rem', height: '38rem', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute', bottom: '-8rem', left: '-8rem',
        width: '32rem', height: '32rem', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    content: {
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', maxWidth: '700px',
    },
    logoCircle: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '64px', height: '64px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem',
        boxShadow: '0 0 30px rgba(99,102,241,0.5)',
    },
    title: {
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: '800', color: '#fff',
        margin: '0 0 1rem', letterSpacing: '-0.03em',
        lineHeight: 1.1,
    },
    subtitle: {
        fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)',
        margin: '0 0 2.5rem', lineHeight: 1.7, maxWidth: '520px',
    },
    actions: {
        display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
        marginBottom: '3rem',
    },
    btnPrimary: {
        padding: '0.875rem 2rem', borderRadius: '12px',
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        color: '#fff', fontWeight: '700', fontSize: '1rem',
        textDecoration: 'none', boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
        transition: 'opacity 0.2s',
    },
    btnSecondary: {
        padding: '0.875rem 2rem', borderRadius: '12px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: '#fff', fontWeight: '600', fontSize: '1rem',
        textDecoration: 'none', backdropFilter: 'blur(10px)',
    },
    features: {
        display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center',
    },
    featureCard: {
        padding: '1.5rem 1.25rem', borderRadius: '16px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(16px)', minWidth: '160px',
    },
    featureIcon: { fontSize: '1.8rem', display: 'block', marginBottom: '0.5rem' },
    featureTitle: { color: '#fff', fontWeight: '700', fontSize: '1rem', margin: '0 0 0.25rem' },
    featureDesc: { color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', margin: 0 },
};

export default Home;

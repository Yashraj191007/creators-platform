import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ConnectionTest from './components/common/ConnectionTest';

// ---------- Home Page ----------
const Home = () => (
  <div style={homeStyles.page}>
    <div style={homeStyles.blob1} />
    <div style={homeStyles.blob2} />
    <div style={homeStyles.content}>
      <div style={homeStyles.badge}>✦ Creator&apos;s Platform</div>
      <h1 style={homeStyles.headline}>Build. Create. Share.</h1>
      <p style={homeStyles.sub}>
        Your creative platform starts here. Register an account and begin your journey.
      </p>
      <div style={homeStyles.btnGroup}>
        <Link to="/register" style={homeStyles.btnPrimary}>Get Started →</Link>
        <Link to="/login" style={homeStyles.btnSecondary}>Sign In</Link>
      </div>
      <div style={homeStyles.testBox}>
        <ConnectionTest />
      </div>
    </div>
  </div>
);

const homeStyles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', top: '-12rem', left: '-8rem',
    width: '40rem', height: '40rem', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', bottom: '-10rem', right: '-6rem',
    width: '35rem', height: '35rem', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  content: {
    position: 'relative', zIndex: 1,
    textAlign: 'center', maxWidth: '560px',
  },
  badge: {
    display: 'inline-block',
    padding: '0.4rem 1rem',
    background: 'rgba(99,102,241,0.2)',
    border: '1px solid rgba(99,102,241,0.4)',
    borderRadius: '999px',
    color: '#a5b4fc',
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '1.5rem',
  },
  headline: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    fontWeight: '800',
    color: '#fff',
    margin: '0 0 1rem',
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
  },
  sub: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.7,
    marginBottom: '2rem',
  },
  btnGroup: {
    display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap',
    marginBottom: '3rem',
  },
  btnPrimary: {
    padding: '0.875rem 2rem',
    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1rem',
    borderRadius: '12px',
    textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
    letterSpacing: '0.01em',
  },
  btnSecondary: {
    padding: '0.875rem 2rem',
    background: 'rgba(255,255,255,0.07)',
    color: '#fff',
    fontWeight: '600',
    fontSize: '1rem',
    borderRadius: '12px',
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.15)',
    letterSpacing: '0.01em',
  },
  testBox: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '1rem',
  },
};

// ---------- App ----------
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
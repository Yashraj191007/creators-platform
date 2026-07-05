import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { toast as hotToast } from 'react-hot-toast';
import { socket } from '../services/socket';

const LIMIT = 6;

const Dashboard = () => {
    const { user, logout } = useAuth();
    const token = localStorage.getItem('token');

    // Posts state
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);



    // Decode JWT payload for display
    let jwtPayload = null;
    try {
        jwtPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    } catch { jwtPayload = null; }

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—';

    // Fetch the user's posts for a given page
    const fetchPosts = useCallback(async (page) => {
        setPostsLoading(true);
        setPostsError('');
        try {
            const response = await api.get(`/api/posts?page=${page}&limit=${LIMIT}`);
            setPosts(response.data.posts);
            setPagination(response.data.pagination);
        } catch (error) {
            setPostsError(error.response?.data?.message || 'Failed to load posts.');
        } finally {
            setPostsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage, fetchPosts]);

    useEffect(() => {
        socket.auth = { token: localStorage.getItem('token') };
        socket.connect();

        const onConnect = () => {
            console.log(`Connected to Socket.io server! ID: ${socket.id}`);
        };

        const onDisconnect = (reason) => {
            console.log(`Disconnected from Socket.io server. Reason: ${reason}`);
        };

        const onConnectError = (error) => {
            console.error('Socket.io connection error:', error);
        };

        const onNewPost = (data) => {
            hotToast.success(data.message);
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectError);
        socket.on('newPost', onNewPost);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectError);
            socket.off('newPost', onNewPost);
            socket.disconnect();
        };
    }, []);

    const handlePrev = () => { if (pagination?.hasPrevPage) setCurrentPage((p) => p - 1); };
    const handleNext = () => { if (pagination?.hasNextPage) setCurrentPage((p) => p + 1); };

    const handleDelete = async (postId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this post? This action cannot be undone.'
        );
        if (!confirmed) return;

        try {
            const response = await api.delete(`/api/posts/${postId}`);
            if (response.data.success) {
                // Optimistic UI update
                setPosts(posts.filter(post => post._id !== postId));
                setPagination(prev => prev ? { ...prev, totalPosts: prev.totalPosts - 1 } : null);
                toast.success('Post deleted successfully');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete post');
        }
    };

    if (!user) return null;

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
                        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
                    </div>
                </header>

                {/* Greeting */}
                <div style={styles.greetingSection}>
                    <h1 style={styles.greeting}>Welcome back, {user.name.split(' ')[0]}! 🎉</h1>
                    <p style={styles.greetingSub}>Manage your posts and account from here.</p>
                </div>

                {/* Top cards grid */}
                <div style={styles.grid}>
                    {/* Profile card */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={styles.cardIcon}>👤</span>
                            <h2 style={styles.cardTitle}>Your Profile</h2>
                        </div>
                        <div>
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

                    {/* JWT card */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={styles.cardIcon}>🔐</span>
                            <h2 style={styles.cardTitle}>Session Token (JWT)</h2>
                        </div>
                        {jwtPayload && (
                            <>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>User ID</span>
                                    <span style={{ ...styles.infoValue, fontFamily: 'monospace', fontSize: '0.75rem' }}>{jwtPayload.userId}</span>
                                </div>
                                <div style={styles.divider} />
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Issued At</span>
                                    <span style={styles.infoValue}>{new Date(jwtPayload.iat * 1000).toLocaleString()}</span>
                                </div>
                                <div style={styles.divider} />
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Expires At</span>
                                    <span style={{ ...styles.infoValue, color: '#10b981' }}>{new Date(jwtPayload.exp * 1000).toLocaleString()}</span>
                                </div>
                            </>
                        )}
                        <div style={styles.tokenBox}>
                            <p style={styles.tokenLabel}>Raw token (localStorage):</p>
                            <code style={styles.tokenCode}>{token?.slice(0, 60)}…</code>
                        </div>
                    </div>
                </div>

                {/* Posts section */}
                <div style={styles.postsSection}>
                    {/* Section header */}
                    <div style={styles.postsHeader}>
                        <div>
                            <h2 style={styles.postsTitle}>📝 Your Posts</h2>
                            {pagination && (
                                <p style={styles.postsMeta}>
                                    {pagination.totalPosts} post{pagination.totalPosts !== 1 ? 's' : ''} total
                                    {pagination.totalPages > 1 && ` · Page ${pagination.currentPage} of ${pagination.totalPages}`}
                                </p>
                            )}
                        </div>
                        <Link to="/create-post" style={styles.createBtn}>
                            ✦ Create Post
                        </Link>
                    </div>

                    {/* Posts content */}
                    {postsLoading && (
                        <div style={styles.stateBox}>
                            <span style={styles.spinner} />
                            <p style={styles.stateText}>Loading your posts…</p>
                        </div>
                    )}

                    {postsError && !postsLoading && (
                        <div style={styles.stateBox}>
                            <p style={{ ...styles.stateText, color: '#fca5a5' }}>⚠️ {postsError}</p>
                        </div>
                    )}

                    {!postsLoading && !postsError && posts.length === 0 && (
                        <div style={styles.emptyBox}>
                            <span style={styles.emptyIcon}>✍️</span>
                            <p style={styles.emptyTitle}>No posts yet</p>
                            <p style={styles.emptySubtitle}>Share your first idea with the community!</p>
                            <Link to="/create-post" style={styles.emptyBtn}>Create your first post →</Link>
                        </div>
                    )}

                    {!postsLoading && !postsError && posts.length > 0 && (
                        <>
                            <div style={styles.postsGrid}>
                                {posts.map((post) => (
                                    <div key={post._id} style={styles.postCard}>
                                        <h3 style={styles.postTitle}>{post.title}</h3>
                                        <p style={styles.postExcerpt}>{post.excerpt || post.content?.substring(0, 120) + '…'}</p>
                                        <div style={styles.postFooter}>
                                            <span style={styles.postDate}>
                                                {new Date(post.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                })}
                                            </span>
                                            <span style={styles.postBadge}>Published</span>
                                        </div>
                                        <div style={styles.postActions}>
                                            <Link to={`/edit/${post._id}`} style={styles.editBtn}>
                                                Edit
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(post._id)}
                                                style={styles.deleteBtn}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination controls */}
                            {pagination && pagination.totalPages > 1 && (
                                <div style={styles.paginationBar}>
                                    <button
                                        onClick={handlePrev}
                                        disabled={!pagination.hasPrevPage}
                                        style={pagination.hasPrevPage ? styles.pageBtn : { ...styles.pageBtn, ...styles.pageBtnDisabled }}
                                    >
                                        ← Previous
                                    </button>

                                    <span style={styles.pageInfo}>
                                        Page {pagination.currentPage} of {pagination.totalPages}
                                        <span style={styles.pageInfoLight}> · {pagination.totalPosts} posts</span>
                                    </span>

                                    <button
                                        onClick={handleNext}
                                        disabled={!pagination.hasNextPage}
                                        style={pagination.hasNextPage ? styles.pageBtn : { ...styles.pageBtn, ...styles.pageBtnDisabled }}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
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
        padding: '1.5rem 1.5rem 4rem',
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
        fontSize: '0.875rem', fontWeight: '600',
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
        marginBottom: '2rem',
    },
    card: {
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
        padding: '1.5rem',
    },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' },
    cardIcon: { fontSize: '1.3rem' },
    cardTitle: { fontSize: '1rem', fontWeight: '700', color: '#fff', margin: 0 },
    infoRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.6rem 0',
    },
    infoLabel: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' },
    infoValue: { fontSize: '0.875rem', color: '#fff', fontWeight: '500', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' },
    divider: { height: '1px', background: 'rgba(255,255,255,0.06)' },
    tokenBox: {
        marginTop: '1rem', padding: '0.75rem',
        background: 'rgba(0,0,0,0.25)', borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.08)',
    },
    tokenLabel: { fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 0.4rem' },
    tokenCode: { fontSize: '0.7rem', color: '#a5b4fc', wordBreak: 'break-all', fontFamily: 'monospace' },
    // Posts section
    postsSection: {
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)',
        padding: '1.75rem',
    },
    postsHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap',
    },
    postsTitle: { fontSize: '1.15rem', fontWeight: '800', color: '#fff', margin: '0 0 0.25rem' },
    postsMeta: { fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', margin: 0 },
    createBtn: {
        padding: '0.55rem 1.2rem',
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        borderRadius: '10px', color: '#fff',
        fontSize: '0.875rem', fontWeight: '700',
        textDecoration: 'none', flexShrink: 0,
        boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
        transition: 'opacity 0.2s',
    },
    stateBox: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '3rem 1rem', gap: '0.75rem',
    },
    spinner: {
        display: 'inline-block', width: '28px', height: '28px',
        border: '3px solid rgba(255,255,255,0.15)', borderTopColor: '#6366f1',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
    },
    stateText: { color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0 },
    emptyBox: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '3.5rem 1rem', gap: '0.6rem',
        background: 'rgba(255,255,255,0.03)', borderRadius: '14px',
        border: '1px dashed rgba(255,255,255,0.1)',
    },
    emptyIcon: { fontSize: '2.5rem', marginBottom: '0.25rem' },
    emptyTitle: { color: '#fff', fontWeight: '700', fontSize: '1rem', margin: 0 },
    emptySubtitle: { color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', margin: 0 },
    emptyBtn: {
        marginTop: '0.75rem', padding: '0.6rem 1.4rem',
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        borderRadius: '10px', color: '#fff',
        fontSize: '0.875rem', fontWeight: '700', textDecoration: 'none',
        boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
    },
    postsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    postCard: {
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '14px', border: '1px solid rgba(255,255,255,0.09)',
        padding: '1.25rem',
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
        transition: 'border-color 0.2s',
    },
    postTitle: {
        fontSize: '0.95rem', fontWeight: '700', color: '#fff',
        margin: 0, lineHeight: 1.4,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
    },
    postExcerpt: {
        fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)',
        margin: 0, lineHeight: 1.6, flex: 1,
        display: '-webkit-box', WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
    },
    postFooter: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '0.5rem',
    },
    postDate: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' },
    postBadge: {
        fontSize: '0.68rem', fontWeight: '600',
        padding: '0.15rem 0.6rem',
        background: 'rgba(16,185,129,0.15)',
        border: '1px solid rgba(16,185,129,0.3)',
        borderRadius: '999px', color: '#6ee7b7',
    },
    postActions: {
        display: 'flex', gap: '0.75rem', marginTop: '1rem',
        paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)',
    },
    editBtn: {
        flex: 1, textAlign: 'center', padding: '0.5rem',
        background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '8px', color: '#a5b4fc', fontSize: '0.8rem', fontWeight: '600',
        textDecoration: 'none', cursor: 'pointer', transition: 'background 0.2s',
    },
    deleteBtn: {
        flex: 1, padding: '0.5rem',
        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)',
        borderRadius: '8px', color: '#fca5a5', fontSize: '0.8rem', fontWeight: '600',
        cursor: 'pointer', transition: 'background 0.2s',
    },
    // Pagination
    paginationBar: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: '1.25rem', flexWrap: 'wrap',
    },
    pageBtn: {
        padding: '0.55rem 1.25rem',
        background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: '10px', color: '#a5b4fc', cursor: 'pointer',
        fontSize: '0.875rem', fontWeight: '600', transition: 'background 0.2s',
    },
    pageBtnDisabled: {
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.2)', cursor: 'not-allowed',
    },
    pageInfo: { fontSize: '0.875rem', color: '#fff', fontWeight: '600' },
    pageInfoLight: { color: 'rgba(255,255,255,0.4)', fontWeight: '400' },
};

export default Dashboard;

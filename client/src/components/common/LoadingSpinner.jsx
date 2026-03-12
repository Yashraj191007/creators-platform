const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div style={containerStyle}>
            <div style={spinnerStyle}></div>
            <p style={textStyle}>{message}</p>
        </div>
    );
};

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    gap: '1rem',
};

const spinnerStyle = {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255,255,255,0.1)',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
};

const textStyle = {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.95rem',
    margin: 0,
    fontFamily: 'system-ui, sans-serif',
};

export default LoadingSpinner;

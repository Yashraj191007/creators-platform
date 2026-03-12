const errorHandler = (err, req, res, next) => {
  // Log error for developers
  console.error('Error:', err);

  // Send consistent response to client
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

export default errorHandler;

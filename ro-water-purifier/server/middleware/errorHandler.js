const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message || err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error. Please try again later.';
  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;

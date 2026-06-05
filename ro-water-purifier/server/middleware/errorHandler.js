const parseDatabaseError = (error) => {
  if (!error || !error.code) {
    return null;
  }

  switch (error.code) {
    case '23505':
      if (error.constraint === 'users_email_unique') {
        return { statusCode: 409, message: 'A user already exists with that email address.' };
      }
      if (error.constraint === 'users_username_unique') {
        return { statusCode: 409, message: 'A user already exists with that username.' };
      }
      if (error.constraint === 'users_mobile_unique') {
        return { statusCode: 409, message: 'A user already exists with that mobile number.' };
      }
      return { statusCode: 409, message: 'Duplicate value violates database constraints.' };
    case '23503':
      return { statusCode: 409, message: 'Invalid reference value for database relation.' };
    default:
      return { statusCode: 500, message: 'Internal database error.' };
  }
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message || err);
  const dbError = parseDatabaseError(err);
  if (dbError) {
    return res.status(dbError.statusCode).json({ success: false, message: dbError.message });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error. Please try again later.';
  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;

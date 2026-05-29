const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.error('Error:', error);

    // mongoose bad object id error
    if (error.name === 'CastError') {
      const message = `Resource not found with id of ${error.value}`;
      error = new Error(message);
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    // mongoose duplicate key error
    if (error.code === 11000) {
      const message = 'Duplicate field value entered';
      error = new Error(message);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    // mongoose validation error
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map(val => val.message)
        .join(', ');
      error = new Error(message);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    // default error
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });

  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
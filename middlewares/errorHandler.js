export const errorHandler = (err, req, res) => {
    console.error(err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

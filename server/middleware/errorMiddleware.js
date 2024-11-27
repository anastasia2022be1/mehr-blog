// Middleware для обработки несуществующих маршрутов (404)
export const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404);
    next(error);
};


// Middleware для обработки ошибок
export const errorMiddleware = (err, req, res, next) => {
    if (res.headersSent) { // Если заголовки уже отправлены, передаем ошибку дальше
        return next(err);
    }

    // Для остальных ошибок возвращаем статус 500 или ошибку с кодом, если он задан
    res.status(err.status || 500).json({
        message: err.message || "An unknown error occurred" // Используем message ошибки, если она есть, или общее сообщение
    });
};


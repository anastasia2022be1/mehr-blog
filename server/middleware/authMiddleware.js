import jwt from "jsonwebtoken";
import HttpError from "../models/errorModel.js";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new HttpError('Authentication required', 401));
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  // Убираем коллбек, передаем только секретный ключ
        req.user = decoded;  // Декодируем и сохраняем информацию о пользователе
        next();
    } catch (error) {
        return next(new HttpError('Invalid token', 401));
    }
};


export default authMiddleware;

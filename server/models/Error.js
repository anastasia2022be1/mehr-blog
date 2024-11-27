class HttpError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.code = errorCode
    }
}

export default HttpError


//----------------------------------------

// import mongoose from "mongoose";

// // Схема для ошибки
// const errorSchema = new mongoose.Schema({
//     message: {
//         type: String,
//         required: true
//     },
//     statusCode: {
//         type: Number,
//         required: true
//     }
// });

// // Создание модели для ошибки
// const HttpError = mongoose.model("HttpError", errorSchema);

// export default HttpError;

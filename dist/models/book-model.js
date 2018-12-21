"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// book.ts
const mongoose = require("mongoose");
const uri = 'mongodb://127.0.0.1:27017/zerwego-api';
mongoose.connect(uri, (err) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("Succesfully Connected!");
    }
});
;
exports.BookSchema = new mongoose.Schema({
    title: String,
    author: String
});
const Book = mongoose.model('Book', exports.BookSchema);
exports.default = Book;
//# sourceMappingURL=book-model.js.map
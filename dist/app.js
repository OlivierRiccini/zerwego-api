"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const book = require("./controllers/book-controller");
const bodyParser = require("body-parser");
// Our Express APP config
const app = express();
app.set("port", process.env.PORT || 3000);
// API Endpoints
// API Endpoints
app.use(bodyParser.json());
app.get('/', book.allBooks);
app.get('/{id}', book.getBook);
app.post('/', book.addBook);
app.put('/{id}', book.updateBook);
app.delete('/{id}', book.deleteBook);
const server = app.listen(app.get("port"), () => {
    console.log("App is running on http://localhost:%d", app.get("port"));
});
//# sourceMappingURL=app.js.map
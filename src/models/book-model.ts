// book.ts
import * as mongoose from 'mongoose';

const uri: string = 'mongodb://127.0.0.1:27017/zerwego-api';

mongoose.connect(uri, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Succesfully Connected!")
    }
});

export interface IBook extends mongoose.Document {
    title: string; 
    author: string; 
};

export const BookSchema = new mongoose.Schema({
    title: String,
    author: String
});
  
const Book = mongoose.model('Book', BookSchema);
export default Book;
import * as mongoose from 'mongoose';

const uri: string = 'mongodb://127.0.0.1:27017/zerwego-api';

mongoose.connect(uri, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Succesfully Connected!")
    }
});

export interface ITrip extends mongoose.Document {
    id?: string,
    tripName: string,
    destination: string,
    imageUrl: string,
    startDate: Date;
    endDate: Date;
};

export const TripSchema = new mongoose.Schema({
    id: String,
    tripName: String,
    destination: String,
    imageUrl: String,
    startDate: Date,
    endDate: Date
});
  
const Trip = mongoose.model('Trip', TripSchema);
export default Trip;
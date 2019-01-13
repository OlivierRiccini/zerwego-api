import * as mongoose from 'mongoose';

export interface ITrip extends mongoose.Document {
    id?: string,
    tripName: string,
    destination: string,
    imageUrl: string,
    startDate: Date;
    endDate: Date;
    adminId: String, 
    usersIds: String[];
};

export const TripSchema = new mongoose.Schema({
    id: String,
    tripName: String,
    destination: String,
    imageUrl: String,
    startDate: Date,
    endDate: Date,
    adminId: String, 
    usersIds: [{
        type: String
    }]
});

const Trip = mongoose.model('Trip', TripSchema);
export default Trip;
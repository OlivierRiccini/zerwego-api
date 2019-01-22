const debug = require('debug')('service');
import mongoose = require('mongoose');
import { Service } from "typedi";
import Trip, { ITrip, TripModel } from '../models/trip-model';

@Service()
export class TripService {
    constructor(private tripModel: TripModel) {
    }
    
    public fetchAll(){
        return this.tripModel.getAll();
    }

    public findById(id: string) {
        return this.tripModel.get(id);
    }

    public createTrip(req: any) {          
        return this.tripModel.create(req);
    }

    public deleteTrip(id: any) {          
        return this.tripModel.delete(id);
    }

    public deleteAllTrips() {
        return this.tripModel.deleteAll();
    }
}
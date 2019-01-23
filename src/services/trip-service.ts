const debug = require('debug')('service');
import mongoose = require('mongoose');
import { Service } from "typedi";
import Trip, { ITrip, TripDAO } from '../models/trip-model';

@Service()
export class TripService {
    constructor(private tripDAO: TripDAO) {
    }
    
    public fetchAll(){
        return this.tripDAO.getAll();
    }

    public findById(id: string) {
        return this.tripDAO.get(id);
    }

    public createTrip(req: any) {          
        return this.tripDAO.create(req);
    }

    public deleteTrip(id: any) {          
        return this.tripDAO.delete(id);
    }

    public deleteAllTrips() {
        return this.tripDAO.deleteAll();
    }
}
const debug = require('debug')('service');
import { Service, Inject } from "typedi";
import { TripDAO, ITrip, TripDocument } from '../models/trip-model';

@Service()
export class TripService {
    // @Inject() tripDAO: TripDAO;
    constructor(private tripDAO: TripDAO) {
        debug('test')
    }
    
    public fetchAll(){
        return this.tripDAO.getAll();
    }

    public findById(id: string) {
        return this.tripDAO.get(id);
    }

    public createTrip(trip: ITrip) {          
        return this.tripDAO.create(trip);
    }

    public updateTrip(trip: ITrip, id: string) {          
        return this.tripDAO.update(trip, id);
    }

    public deleteTrip(id: string) {          
        return this.tripDAO.delete(id);
    }
}
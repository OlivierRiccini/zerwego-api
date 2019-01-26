const debug = require('debug')('service');
import { Service, Inject } from "typedi";
import { TripDAO } from '../models/trip-model';

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

    public createTrip(req: any) {          
        return this.tripDAO.create(req);
    }

    public deleteTrip(id: any) {          
        return this.tripDAO.delete(id);
    }
}
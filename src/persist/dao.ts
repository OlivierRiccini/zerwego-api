import * as mongoose from 'mongoose';
const debug = require('debug')('DAO');

export interface DAO<T> {
    create(model: T):Promise<T>;
    get(id: number|string): Promise<T|any>;
    getAll(): Promise<[T]>;
    update(model: any): Promise<T>;
    delete(id: number|string): Promise<any>;
    deleteAll(): Promise<any>;
    find(findOptions: FindOptions): Promise<T[]>;
    findAndRemove(deleteOptions: DeleteOptions): Promise<any>;
    count(findOptions: FindOptions): Promise<any>;
}

export interface FindOptions {
    find?: any,
    offset?: any,
    limit?: any,
    sort?: any,
    select?: any
};

export interface DeleteOptions {
    find?: any,
    offset?: any,
    limit?: any,
    sort?: any,
    select?: any
};

// mongoose.Document
// CHECK https://github.com/Eslem/TSGeneric-DAO-API/blob/master/src/persistence/impl/mongoose/GenericDAOImplMongoose.ts
export abstract class DAOImpl<T, Q extends mongoose.Document> implements DAO<T> {
    static _model;
    public model;
    static created = false;

    constructor(protected _modelName: string, protected _modelSchema, private connection?: mongoose.Mongoose) {
        if (!this.constructor['created']) {
            if (connection) {
                this.constructor['_model'] = connection.model<Q>(_modelName, _modelSchema);
            } else {
                this.constructor['_model'] = mongoose.model<Q>(_modelName, _modelSchema);
            }
            this.constructor['created'] = true;
        }
        this.model = this.constructor['_model'];
    }

    create(model: T):Promise<T> {
        return new Promise((resolve, reject) => {
            let trip = new this.model(model);
            trip.id = trip._id
            trip.save((err, res) => {
                if (err) {
                    debug('createTrip - FAILED => ' + err);
                    reject(err);
                }
                let trip = res.toObject();
                trip.startDate = new Date(trip.startDate);
                trip.endDate = new Date(trip.endDate);
                debug('createTrip - OK => ' + JSON.stringify(trip));
                resolve(trip);
            });
        })
    };

    get(id:number|string): Promise<T|any> {
        return new Promise((resolve, reject) => {
            this.model.findOne({ id })
            .lean()
            .exec((err: any, trip: any) => {
                if (err) {
                    debug('get - FAILED => Trip with id => ${id} not found');
                    reject(new Error(`Trip with id => ${id} not found`));
                } else {
                    debug('get - OK => ' + JSON.stringify(trip));
                    resolve(trip);
                }
            })
        })
    };

    getAll():Promise<[T]> {
        return new Promise((resolve, reject) => {
            this.model.find({})
            .lean()
            .exec((err: any, res: any) => {
                if (err) {
                    debug('findById - FAILED => No trips found');
                    reject(new Error("No trips found"));
                } else {
                    resolve(res);
                }
            })
        });
    };

    update(model:any):Promise<T> {
        return new Promise((resolve, reject) => {
            let trip = new this.model(model);
            trip.id = trip._id
            trip.save((err, res) => {
                if (err) {
                    debug('createTrip - FAILED => ' + err);
                    reject(err);
                }    
                let trip = res.toObject();
                trip.startDate = new Date(trip.startDate);
                trip.endDate = new Date(trip.endDate);
                debug('createTrip - OK => ' + JSON.stringify(trip));
                resolve(trip);
            });
        })
    };

    delete(id:number|string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.model.deleteOne({ id }, err => {
                if (err) {
                    debug('deleteTrip - FAILED => ' + JSON.stringify(err));
                    reject(err);
                }
                debug('deleteTrip - OK');
                resolve({ message: 'Deleted' });    
            });
        })
    };

    deleteAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.model.deleteMany({}, err => {
                if (err) {
                    debug('deleteAllTrips - FAILED => ' + JSON.stringify(err));
                    reject(err);
                }
                debug('deleteAllTrips - OK');
                resolve({ message: 'Deleted' }); 
            });
        })
    }

    find(findOptions: FindOptions): Promise<T[]> {
        console.log(findOptions);
        return new Promise((resolve, reject) => {
            this.model.find(findOptions.find)
            .lean()
            .exec((err: any, res: any) => {
                if (err) {
                    debug('find - FAILED => No trips found');
                    reject(new Error("No trips found"));
                } else {
                    resolve(res);
                }
            })
        });
    }

    findAndRemove(deleteOptions: DeleteOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            this.model.deleteOne(deleteOptions, err => {
                if (err) {
                    debug('findAndRemove - FAILED => ' + JSON.stringify(err));
                    reject(err);
                }
                debug('findAndRemove - OK', JSON.stringify('rr'));
                resolve({ message: 'Deleted' });    
            });
        })
    }

    count(findOptions: FindOptions): Promise<number> {
        return new Promise((resolve, reject) => {
            this.model.countDocuments(findOptions)
            .lean()
            .exec((err: any, res: any) => {
                if (err) {
                    debug('count - FAILED => No trips found');
                    reject(new Error("No trips found"));
                } else {
                    resolve(res);
                }
            })
        });
    }

}
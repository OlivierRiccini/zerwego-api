import * as mongoose from 'mongoose';
import { ITrip } from 'src/models/trip-model';
import { IUser } from 'src/models/user-model';
const debug = require('debug')('DAO');
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

export interface DAO<T> {
    create(model: T):Promise<T>;
    get(id: number|string): Promise<T|any>;
    getAll(): Promise<[T]>;
    update(model: any, id?: string): Promise<T>;
    delete(id: number|string): Promise<any>;
    deleteAll(): Promise<any>;
    find(findOptions: FindOptions): Promise<T[]>;
    // findAndRemove(deleteOptions: DeleteOptions): Promise<any>;
    count(findOptions: FindOptions): Promise<any>;
    // removeToken(id: string): Promise<T>;
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
            let document = new this.model(model);
            document.id = document._id
            document.save((err, res) => {
                if (err) {
                    debug('create a document - FAILED => ' + err);
                    return reject(err);
                }
                let document = res.toObject();
                debug('create a document - OK => ' + JSON.stringify(document));
                resolve(document);
            });
        })
    };

    get(id:number|string): Promise<T|any> {
        return new Promise((resolve, reject) => {
            this.model.findOne({ id })
            .lean()
            .exec((err: any, document: any) => {
                if (err) {
                    debug('get - FAILED => document with id => ${id} not found');
                    reject(new Error(`Document with id => ${id} not found`));
                } else {
                    debug('get - OK => ' + JSON.stringify(document));
                    resolve(document);
                }
            })
        })
    };

    getAll(): Promise<[T]> {
        return new Promise((resolve, reject) => {
            this.model.find({})
            .lean()
            .exec((err: any, res: any) => {
                if (err) {
                    debug('findById - FAILED => No documents found');
                    reject(new Error("No documents found"));
                } else {
                    resolve(res);
                }
            })
        });
    };

    update(obj: any, id?: string): Promise<T> {
        return new Promise<T>(
            (resolve: Function, reject: Function) => {
                if (!_.isObject(obj)) {
                    return reject(new TypeError('DAO.update value passed is not object.'));
                }
                if (!id && !obj._id) {
                    return reject(new TypeError('DAO.update object passed doesn\'t have _id or id.'));
                }
                this.model.findById(id || obj._id).exec(
                    (err, found) => {
                        if (err) { reject(err) };
                        if (!found) { resolve(found) };
                        let updated = _.merge(found, obj);
                        updated.save(
                            (err, updated) => {
                                err ? reject(err) : resolve(updated.toObject())
                            }
                        )
                    }
                );
            }
        );
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
                    debug('deleteAll documents - FAILED => ' + JSON.stringify(err));
                    reject(err);
                }
                debug('deleteAll documents - OK');
                resolve({ message: 'Deleted' }); 
            });
        })
    }

    find(findOptions: FindOptions): Promise<T[]> {
        // TODO: fix the find
        return new Promise((resolve, reject) => {
            this.model.find(findOptions.find)
            .lean()
            .exec((err: any, res: any) => {
                if (err) {
                    debug('find - FAILED => No documents found');
                    reject(new Error("No documents found"));
                } else {
                    resolve(res);
                }
            })
        });
    };

    // findAndRemove(deleteOptions: DeleteOptions): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this.model.deleteOne(deleteOptions, err => {
    //             if (err) {
    //                 debug('findAndRemove - FAILED => ' + JSON.stringify(err));
    //                 reject(err);
    //             }
    //             debug('findAndRemove - OK', JSON.stringify('rr'));
    //             resolve({ message: 'Deleted' });    
    //         });
    //     })
    // };

    count(findOptions: FindOptions): Promise<number> {
        return new Promise((resolve, reject) => {
            this.model.countDocuments(findOptions)
            .lean()
            .exec((err: any, res: any) => {
                if (err) {
                    debug('count - FAILED => No documents found');
                    reject(new Error("No documents found"));
                } else {
                    resolve(res);
                }
            })
        });
    };
}
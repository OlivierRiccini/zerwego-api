"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const debug = require('debug')('DAO');
const _ = require("lodash");
;
;
// mongoose.Document
// CHECK https://github.com/Eslem/TSGeneric-DAO-API/blob/master/src/persistence/impl/mongoose/GenericDAOImplMongoose.ts
class DAOImpl {
    constructor(_modelName, _modelSchema, connection) {
        this._modelName = _modelName;
        this._modelSchema = _modelSchema;
        this.connection = connection;
        if (!this.constructor['created']) {
            if (connection) {
                this.constructor['_model'] = connection.model(_modelName, _modelSchema);
            }
            else {
                this.constructor['_model'] = mongoose.model(_modelName, _modelSchema);
            }
            this.constructor['created'] = true;
        }
        this.model = this.constructor['_model'];
    }
    create(model) {
        return new Promise((resolve, reject) => {
            let document = new this.model(model);
            document.id = document._id;
            document.save((err, res) => {
                if (err) {
                    debug('create a document - FAILED => ' + err);
                    return reject(err);
                }
                let document = res.toObject();
                debug('create a document - OK => ' + JSON.stringify(document));
                resolve(document);
            });
        });
    }
    ;
    get(id) {
        return new Promise((resolve, reject) => {
            this.model.findOne({ id })
                .lean()
                .exec((err, document) => {
                if (err) {
                    debug('get - FAILED => document with id => ${id} not found');
                    reject(new Error(`Document with id => ${id} not found`));
                }
                else {
                    debug('get - OK => ' + JSON.stringify(document));
                    resolve(document);
                }
            });
        });
    }
    ;
    getAll() {
        return new Promise((resolve, reject) => {
            this.model.find({})
                .lean()
                .exec((err, res) => {
                if (err) {
                    debug('findById - FAILED => No documents found');
                    reject(new Error("No documents found"));
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    ;
    update(obj, id) {
        return new Promise((resolve, reject) => {
            if (!_.isObject(obj)) {
                return reject(new TypeError('DAO.update value passed is not object.'));
            }
            if (!id && !obj._id) {
                return reject(new TypeError('DAO.update object passed doesn\'t have _id or id.'));
            }
            this.model.findById(id || obj._id).exec((err, found) => {
                if (err) {
                    reject(err);
                }
                ;
                if (!found) {
                    resolve(found);
                }
                ;
                let updated = _.merge(found, obj);
                updated.save((err, updated) => {
                    err ? reject(err) : resolve(updated.toObject());
                });
            });
        });
    }
    ;
    delete(id) {
        return new Promise((resolve, reject) => {
            this.model.deleteOne({ id }, err => {
                if (err) {
                    debug('deleteTrip - FAILED => ' + JSON.stringify(err));
                    reject(err);
                }
                debug('deleteTrip - OK');
                resolve({ message: 'Deleted' });
            });
        });
    }
    ;
    deleteAll() {
        return new Promise((resolve, reject) => {
            this.model.deleteMany({}, err => {
                if (err) {
                    debug('deleteAll documents - FAILED => ' + JSON.stringify(err));
                    reject(err);
                }
                debug('deleteAll documents - OK');
                resolve({ message: 'Deleted' });
            });
        });
    }
    find(findOptions) {
        // TODO: fix the find
        return new Promise((resolve, reject) => {
            this.model.find(findOptions.find)
                .lean()
                .exec((err, res) => {
                if (err) {
                    debug('find - FAILED => No documents found');
                    reject(new Error("No documents found"));
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    ;
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
    count(findOptions) {
        return new Promise((resolve, reject) => {
            this.model.countDocuments(findOptions)
                .lean()
                .exec((err, res) => {
                if (err) {
                    debug('count - FAILED => No documents found');
                    reject(new Error("No documents found"));
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    ;
}
DAOImpl.created = false;
exports.DAOImpl = DAOImpl;
//# sourceMappingURL=dao.js.map
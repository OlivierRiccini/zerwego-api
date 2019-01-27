'use strict';
process.env.NODE_ENV = 'test';

import 'mocha';
import * as chai from 'chai';
import { MODELS, MODELS_DATA } from '../data-test/common-data';
import { FindOptions } from '../../src/persist/dao';
const forEach = require('mocha-each');

const debug = require('debug')('test');

const expect = chai.expect;
chai.should();

describe('COMMON - TESTING EACH MODEL DAO - ./common/dao.test', function() {

    beforeEach('Clean up', (done) => {
        for (const MODEL of MODELS) {
            const modelDAO = MODEL.DAO;
            modelDAO.deleteAll()
                .then(() => debug('Done, DB cleaned up after tests!'))
                .catch(err => debug('Error during cleaning DB test= ' + err))
            }
        done();  
    }); 

    afterEach('Clean up', (done) => {
        for (const MODEL of MODELS) {
            const modelDAO = MODEL.DAO;
            modelDAO.deleteAll()
                .then(() => debug('Done, DB cleaned up after tests!'))
                .catch(err => debug('Error during cleaning DB test= ' + err))
            } 
        done();  
    }); 
    
    forEach(MODELS)
    .it('Should create a valid document', async MODEL => {
        const modelDAO = MODEL.DAO;
        return modelDAO.create(MODELS_DATA[MODEL.name][0])
            .then(
                response => {
                    expect(response).to.have.property('id').to.be.a('string');
                },
                err => {
                    debug(err)
                }
            )
        }
    );

    forEach(MODELS)
    .it('Should get a document based on id', async MODEL => {
        const modelDAO = MODEL.DAO;
        const newInstance = await modelDAO.create(MODELS_DATA[MODEL.name][0]);

        return modelDAO.get(newInstance.id)
            .then(
                response => {
                    expect(response).to.have.property('id').to.be.a('string');
                },
                err => {
                    debug(err)
                }
            )
    });

    forEach(MODELS)
    .it('Should getAll documents', async MODEL => {
        const modelDAO = MODEL.DAO;

        for (const modelData of MODELS_DATA[MODEL.name]) {
            await modelDAO.create(modelData);
        }

        return modelDAO.getAll()
            .then(
                response => {
                    expect(response).to.have.lengthOf(2);

                },
                err => {
                    debug(err)
                }
            )
    });

    // forEach(MODELS)
    // .it('Should find a doc based on a property', async MODEL => {
    //     const modelDAO = MODEL.DAO;
    //     const doc = await modelDAO.create(MODELS_DATA[MODEL.name][0]);

    //     const findOptions: FindOptions = { find: { tripName: 'LA' } };

    //     return modelDAO.find(findOptions)
    //         .then(
    //             response => {
    //                 expect(response[0]).to.have.property('tripName').to.equals('LA');
    //             },
    //             err => {
    //                 debug(err)
    //             }
    //         )
    // });
});


// find(findOptions: FindOptions): Promise<T[]>;
// update(model:any):Promise<T>;
// delete(id:number|string):Promise<any>;
// deleteAll():Promise<any>;
// findAndRemove(deleteOptions: DeleteOptions): Promise<any>;
// count(findOptions: FindOptions): Promise<any>;
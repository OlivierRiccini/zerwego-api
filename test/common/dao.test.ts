'use strict';
process.env.NODE_ENV = 'test';

import 'mocha';
import mongoose = require('mongoose');
import * as chai from 'chai';
import { MODELS, MODELS_DATA } from '../seed/common-data';
import { FindOptions } from '../../src/persist/dao';

const debug = require('debug')('test');

const expect = chai.expect;
chai.should();

for (const MODEL of MODELS) {

    const modelDAO = MODEL.DAO;

    describe('DAO - ' + MODEL.name, function() {

        beforeEach('Clean up', (done) => {
            modelDAO.deleteAll()
              .then(() => debug('Done, DB cleaned up after tests!'))
              .catch(err => debug('Error during cleaning DB test= ' + err))
            done();  
        }); 
    
        afterEach('Clean up', (done) => {
            modelDAO.deleteAll()
              .then(() => debug('Done, DB cleaned up after tests!'))
              .catch(err => debug('Error during cleaning DB test= ' + err))
            done();  
        }); 
    
        it('Should create a valid doc DAO', async () => {
            return modelDAO.create(MODELS_DATA[MODEL.name][0])
                .then(
                    response => {
                        expect(response).to.have.property('id').to.be.a('string');
                        expect(response).to.have.property('tripName');
                        expect(response).to.have.property('destination');
                        expect(response).to.have.property('imageUrl');
                        expect(response).to.have.property('startDate');
                        expect(response).to.have.property('endDate');
                        expect(response).to.have.property('adminId');
                    },
                    err => {
                        debug(err)
                    }
                )
            }
        );
    });

    it('Should get a doc based on id', async () => {
        const newInstance = await modelDAO.create(MODELS_DATA[MODEL.name][0]);

         return modelDAO.get(newInstance.id)
            .then(
                response => {
                    expect(response).to.have.property('id').to.be.a('string');
                    expect(response).to.have.property('tripName');
                    expect(response).to.have.property('destination');
                    expect(response).to.have.property('imageUrl');
                    expect(response).to.have.property('startDate');
                    expect(response).to.have.property('endDate');
                    expect(response).to.have.property('adminId');
                },
                err => {
                    debug(err)
                }
            )
    });

    it('Should getAll docs', async () => {

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

    it('Should find a doc based on a property', async () => {
        await modelDAO.create(MODELS_DATA[MODEL.name][0]);

        const findOptions: FindOptions = { find: { tripName: 'LA' } };

        return modelDAO.find(findOptions)
            .then(
                response => {
                    console.log(response);
                    expect(response[0]).to.have.property('tripName').to.equals('LA');
                },
                err => {
                    debug(err)
                }
            )
    });


}

// update(model:any):Promise<T>;
// delete(id:number|string):Promise<any>;
// deleteAll():Promise<any>;
// find(findOptions: FindOptions): Promise<T[]>;
// findAndRemove(deleteOptions: DeleteOptions): Promise<any>;
// count(findOptions: FindOptions): Promise<any>;
import mongoose = require('mongoose');
import { Service } from "typedi";
import Trip from '../models/trip-model';

@Service()
export class TripService {
    constructor() {
    }
    
    fetchAll(){
        return new Promise((resolve, reject) => {
            
            Trip.find({})
            .exec((err: any, res: any) => {
                if (err) {
                    reject(new Error("No trips found"));
                } else {
                    let finalResponse = [];
                    for (let obj of res) {
                        console.log(obj);
                        finalResponse.push(obj._doc);
                    }
                    resolve(finalResponse);
                    console.log(finalResponse);
                }
            })
        });
    }
}
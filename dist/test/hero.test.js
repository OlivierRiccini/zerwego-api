"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiHttp = require("chai-http");
const express_config_1 = require("../setup/express-config");
chai.use(chaiHttp);
const expect = chai.expect;
describe('GET api/v1/heroes', () => {
    it('responds with JSON array', () => {
        return chai.request(express_config_1.default).get('/api/v1/heroes')
            .then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(5);
        });
    });
    it('should include Wolverine', () => {
        return chai.request(express_config_1.default).get('/api/v1/heroes')
            .then(res => {
            let Wolverine = res.body.find(hero => hero.name === 'Wolverine');
            expect(Wolverine).to.exist;
            expect(Wolverine).to.have.all.keys([
                'id',
                'name',
                'aliases',
                'occupation',
                'gender',
                'height',
                'hair',
                'eyes',
                'powers'
            ]);
        });
    });
});
//# sourceMappingURL=hero.test.js.map
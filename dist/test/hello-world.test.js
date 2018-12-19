"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiHttp = require("chai-http");
const express_config_1 = require("../setup/express-config");
chai.use(chaiHttp);
const expect = chai.expect;
describe('baseRoute', () => {
    it('should be json', () => {
        return chai.request(express_config_1.default).get('/')
            .then(res => {
            expect(res.type).to.eql('application/json');
        });
    });
    it('should have a message prop', () => {
        return chai.request(express_config_1.default).get('/')
            .then(res => {
            expect(res.body.message).to.eql('Hello Inho le Boss!');
        });
    });
});
//# sourceMappingURL=hello-world.test.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const Heroes = ['Wolverine', 'xx', 'cc', 'cs', 'ee'];
class HeroRouter {
    /**
     * Initialize the HeroRouter
     */
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    /**
     * GET all Heroes.
     */
    getAll(req, res, next) {
        res.send(Heroes);
    }
    post(req, res) {
        let user = new User_1.User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });
        console.log(user);
        user.save().then((doc) => {
            res.status(200).send(doc);
        }, (e) => {
            res.status(400).send(e);
        });
    }
    ;
    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/heros', this.getAll);
        this.router.post('/heros', this.post);
    }
}
exports.HeroRouter = HeroRouter;
// Create the HeroRouter, and export its configured Express.Router
const heroRoutes = new HeroRouter();
heroRoutes.init();
exports.default = heroRoutes.router;
//# sourceMappingURL=hero-router.js.map
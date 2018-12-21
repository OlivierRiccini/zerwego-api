import {Router, Request, Response, NextFunction} from 'express';
import { UserSchema } from '../schemas/user-schema';
import {User} from "../models/User";

const Heroes = ['Wolverine', 'xx','cc' ,'cs' ,'ee' ];

export class HeroRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET all Heroes.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    res.send(Heroes);
  }

  public post(req: Request, res: Response) {   

    let user = new User({
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
  };

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/heros', this.getAll);
    this.router.post('/heros', this.post);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const heroRoutes = new HeroRouter();
heroRoutes.init();

export default heroRoutes.router;
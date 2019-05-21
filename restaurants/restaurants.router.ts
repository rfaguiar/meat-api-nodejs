import * as restify from 'restify';
import {ModelRouter} from "../common/model-router";
import {Restaurant} from "./restaurants.model";
import {NotFoundError} from "restify-errors";

class RestaurantsRouter extends ModelRouter<Restaurant> {

    constructor() {
        super(Restaurant);
    }

    private findMenu(req: restify.Request, res: restify.Response, next: restify.Next) {
        Restaurant.findById(req.params.id, '+menu')
            .then((rest: Restaurant) => {
                if (rest) {
                    res.json(rest.menu);
                    return next();
                } else {
                    throw new NotFoundError('Restaurant not found');
                }
            }).catch(next);
    }

    private replaceMenu(req: restify.Request, res: restify.Response, next: restify.Next) {
        Restaurant.findById(req.params.id)
            .then((rest: Restaurant) => {
                if (rest) {
                    rest.menu = req.body;
                    return rest.save();
                } else {
                    throw new NotFoundError('Restaurant not found');
                }
            }).then((rest: Restaurant) => {
            res.json(rest.menu);
            return next();
        }).catch(next);
    }

    public applyRoutes(application: restify.Server) {
        application.get('/restaurants', this.findAll);
        application.get('/restaurants/:id', [this.validateId, this.findById]);
        application.post('/restaurants', this.save);
        application.put('/restaurants/:id', [this.validateId, this.replace]);
        application.patch('restaurants/:id', [this.validateId, this.update]);
        application.del('/restaurants/:id', [this.validateId, this.delete]);

        application.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);
        application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu]);
    }

}

export const restaurantsRouter = new RestaurantsRouter();
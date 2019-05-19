import * as restify from 'restify';
import {BEFORE_RENDER, Router} from "../common/router";
import {User} from "./users.model";

class UsersRouter extends Router {

    constructor() {
        super();
        this.on(BEFORE_RENDER, (document: User) => document.password = undefined);
    }

    applyRoutes(application: restify.Server) {
        application.get('/users', (req, resp, next) => {
            User.find().then(this.render(resp, next));
        });

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id)
                .then(this.render(resp, next));
        });

        application.post('/users', (req, res, next) => {
            let user = new User(req.body);
            user.save().then(this.render(res, next));
        });

        application.put('/users/:id', (req, res, next) => {
            const options = {overwrite: true};
            User.update({_id: req.params.id}, req.body, options)
                .exec().then(result => {
                    if (result.n) {
                        return User.findById(req.params.id);
                    } else {
                        res.send(404);
                    }
                }).then(this.render(res, next));
        });

        application.patch('users/:id', (req, res, next) => {
            const options = {new: true};
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(user => {
                    if (user) {
                        res.json(user);
                    } else {
                        res.send(404);
                    }
                    return next();
                });
        });

        application.del('/users/:id', (req, res, next) => {
            User.remove({_id: req.params.id})
                .exec().then((cmdResult: any) => {
                    if (cmdResult.result.n) {
                        res.send(204);
                    } else {
                        res.send(404);
                    }
                    return next();
            });
        });
    }
    
}

export const usersRouter =  new UsersRouter();
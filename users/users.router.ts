import * as restify from 'restify';
import {BEFORE_RENDER} from "../common/router";
import {User} from "./users.model";
import {ModelRouter} from "../common/model-router";

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User);
        this.on(BEFORE_RENDER, (document: User) => document.password = undefined);
    }

    applyRoutes(application: restify.Server) {
        application.get('/users', this.findAll);
        application.get('/users/:id', [this.validateId, this.findById]);
        application.post('/users', this.save);
        application.put('/users/:id', [this.validateId, this.replace]);
        application.patch('users/:id', [this.validateId, this.update]);
        application.del('/users/:id', [this.validateId, this.delete]);
    }
    
}

export const usersRouter =  new UsersRouter();
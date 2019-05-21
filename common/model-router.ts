import * as restify from 'restify';
import {Router} from "../common/router";
import * as mongoose from "mongoose";
import {NotFoundError} from "restify-errors";

export abstract class ModelRouter<D extends mongoose.Document> extends Router {

    protected constructor(protected model: mongoose.Model<D>) {
        super();
    }

    validateId = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            next();
        } else {
            next(new NotFoundError('Document not found'));
        }
    };

    findAll = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        this.model.find()
            .then(this.renderAll(resp, next))
            .catch(next);
    };

    findById = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        this.model.findById(req.params.id)
            .then(this.render(resp, next))
            .catch(next);
    };

    save = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        let document = new this.model(req.body);
        document.save()
            .then(this.render(resp, next))
            .catch(next);
    };

    replace = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        const options = {runValidators: true, overwrite: true};
        this.model.update({_id: req.params.id}, req.body, options)
            .exec().then((result: any) => {
            if (result.n) {
                return this.model.findById(req.params.id);
            } else {
                throw new NotFoundError('Documento não encontrado');
            }
        }).then(this.render(resp, next))
            .catch(next);
    };

    update = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        const options = {runValidators: true, new: true};
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
            .then((document: D) => {
                if (document) {
                    resp.json(document);
                } else {
                    throw new NotFoundError('Documento não encontrado');
                }
                return next();
            }).catch(next);
    };

    delete = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        this.model.remove({_id: req.params.id})
            .exec()
            .then((cmdResult: any) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                } else {
                    throw new NotFoundError('Documento não encontrado');
                }
                return next();
            }).catch(next);
    };
}
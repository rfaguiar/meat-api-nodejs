import * as restify from 'restify';
import * as mongoose from 'mongoose';
import {environment} from "../common/environment";
import {Router} from "../common/router";
import {handleError} from "./error.handler";

export class Server {

    application: restify.Server;

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeBb()
            .then(() => this.initRoutes(routers).then(() => this));
    }

    private initializeBb(): mongoose.MongooseThenable {
        (<any>mongoose).Promise = global.Promise;
        return mongoose.connect(environment.db.url, {
            useMongoClient: true,
            authdb: environment.db.authdb,
            user: environment.db.user,
            pass: environment.db.password
        });
    }

    private initRoutes(routers: Router[]):Promise<any> {
        return new Promise<any>(((resolve, reject) => {
            try {

                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });

                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());

                routers.map((router => router.applyRoutes(this.application)));

                this.application.listen(environment.server.port, () => resolve(this.application));

                this.application.on('restifyError', handleError);

            }catch (e) {
                reject(e);
            }
        }));
    }
}
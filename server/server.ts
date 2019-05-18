import * as restify from 'restify';
import {environment} from "../common/environment";
import {Router} from "../common/router";

export class Server {

    application: restify.Server;

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initRoutes(routers).then(() => this);
    }

    private initRoutes(routers: Router[]):Promise<any> {
        return new Promise<any>(((resolve, reject) => {
            try {

                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });

                this.application.use(restify.plugins.queryParser());

                routers.map((router => router.applyRoutes(this.application)));

                this.application.listen(environment.server.port, () => resolve(this.application));

            }catch (e) {
                reject(e);
            }
        }));
    }
}
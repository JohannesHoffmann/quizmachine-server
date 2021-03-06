import {HapiPlugin, HapiPluginInfo} from "../interfaces";
import * as Hapi from "hapi";
import * as Inert from "inert";
import * as Vision from "vision";
import * as HapiSwagger from "hapi-swagger";

export default (): HapiPlugin => {
    return {
        register: (server: Hapi.Server) => {

            server.register(Inert);

            server.register([
                Vision,
                {
                    register: HapiSwagger,
                    options: {
                        info: {
                            title: 'Task Api',
                            description: 'Task Api Documentation',
                            version: '1.0'
                        },
                        tags: [
                            {
                                'name': 'tasks',
                                'description': 'Api tasks interface.'
                            },
                            {
                                'name': 'users',
                                'description': 'Api users interface.'
                            }
                        ],
                        enableDocumentation: true,
                        documentationPath: '/docs'
                    }
                }
            ]
                , (error) => {
                    if (error) {
                        console.error('error', error);
                    }
                });
        },
        info: () => {
            return {
                name: "Swagger Documentation",
                version: "1.0.0"
            };
        }
    };
};
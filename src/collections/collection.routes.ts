import * as Hapi from "hapi";
import * as Joi from "joi";
import * as Path from "path";
import CollectionController from "./collection.controller";
import * as TaskValidator from "./collection.validator";
import { jwtValidator } from "../users/user.validator";
import { Database } from "../database";
import { ServerConfigurations } from "../configurations";
import * as Configs from "../../src/configurations";

declare let __dirname;
const filesConfig = Configs.getFilesConfigs();

export default function (server: Hapi.Server, configs: ServerConfigurations, database: Database) {

    const collectionController = new CollectionController(configs, database);
    server.bind( collectionController);

    server.route({
        method: 'GET',
        path: '/collections/{id}',
        config: {
            handler:  collectionController.getCollectionById,
            auth: "jwt",
            tags: ['api', 'tasks'],
            description: 'Get collection by id.',
            validate: {
                params: {
                    id: Joi.string().required()
                },
                headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Task founded.'
                        },
                        '404': {
                            'description': 'Task does not exists.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/collections',
        config: {
            handler:  collectionController.getCollections,
            auth: "jwt",
            tags: ['api', 'tasks'],
            description: 'Get all tasks.',
            validate: {
                query: {
                    limit: Joi.number().default(5),
                    skip: Joi.number().default(0)
                },
                headers: jwtValidator
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/collections/{id}',
        config: {
            handler:  collectionController.deleteCollection,
            auth: {
                strategy: "jwt",
                scope: ["admin"],
            },
            tags: ['api', 'tasks'],
            description: 'Delete collection by id.',
            validate: {
                headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Deleted Collection.',
                        },
                        '404': {
                            'description': 'Collection does not exists.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/collections/{id}',
        config: {
            handler:  collectionController.updateCollection,
            auth: {
                strategy: "jwt",
                scope: ["admin"],
            },
            tags: ['api', 'tasks'],
            description: 'Update collection by id.',
            payload: {
                maxBytes: 209715200,
                output: 'file',
                allow: 'multipart/form-data',
            },
            validate: {
                params: {
                    id: Joi.string().required()
                },
                payload: TaskValidator.updateCollectionModel,
                headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Update Collection.',
                        },
                        '404': {
                            'description': 'Collection does not exists.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/collections',
        config: {
            handler:  collectionController.createCollection,
            auth: {
                strategy: "jwt",
                scope: ["admin"],
            },
            tags: ['api', 'tasks'],
            description: 'Create a task.',
            payload: {
                maxBytes: 209715200,
                output: 'file',
                allow: 'multipart/form-data',
            },
            validate: {
                payload: TaskValidator.createCollectionModel,
                headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Created Task.'
                        }
                    }
                }
            }
        }
    });


    server.route({
        method: 'POST',
        path: '/collections/upload',
        config: {
            handler:  collectionController.fileUploadCollection,
            auth: {
                strategy: "jwt",
                scope: ["admin"],
            },
            payload: {
                maxBytes: 209715200,
                output: 'file',
                allow: 'multipart/form-data',
            },
            tags: ['api', 'tasks'],
            description: 'Create a Collection.',
            validate: {
                payload: TaskValidator.updateCollectionModel,
                headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Created Collection.'
                        }
                    }
                }
            }
        }
    });


    server.route({
        method: 'GET',
        path: '/collection/images/{file*}',
        handler: {
            directory: {
                path: Path.join(__dirname, '../../../', filesConfig.storage, '/collections')
            }
        }
    });

}
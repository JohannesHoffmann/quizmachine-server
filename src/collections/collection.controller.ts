import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Fs from "fs";
import * as Path from "path";
import { Collection, CollectionModel } from "./collection.schema";
import { Database } from "../database";
import {ServerConfigurations, FilesConfiguration} from "../configurations";
import * as Configs from "../configurations";

export default class CollectionController {

    private database: Database;
    private configs: ServerConfigurations;
    private file_config: FilesConfiguration;

    constructor(configs: ServerConfigurations, database: Database) {
        this.configs = configs;
        this.database = database;
        this.file_config = Configs.getFilesConfigs();
    }

    public createCollection(request: Hapi.Request, reply: Hapi.IReply) {
        let newCollection: Collection = request.payload;

        this.database.collectionModel.create(newCollection).then((collection) => {

            let image_path = request.payload.image.path;
            let new_image_path = Path.dirname(request.payload.image.path) + "/" + collection._id + Path.extname(request.payload.image.filename);

            Fs.rename(image_path, new_image_path, () => {

                collection.attach('attachments', {path: new_image_path}, (error) => {
                    if (error) {
                        reply(Boom.badImplementation(error));
                    } else {
                        collection.save();
                        reply(collection).code(201);
                    }
                });

            });


        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }

    public updateCollection(request: Hapi.Request, reply: Hapi.IReply) {
        let updated_collection: Collection = request.payload;
        let id = request.params.id;

        this.database.collectionModel.findByIdAndUpdate({ _id: id }, { $set: updated_collection }, { new: true })
            .then((updated_collection: Collection) => {
                if (updated_collection) {

                    // rename file for better storage!
                    let image_path = request.payload.image.path;
                    let new_image_path = Path.dirname(request.payload.image.path) + "/" + id + Path.extname(request.payload.image.filename);

                    Fs.rename(image_path, new_image_path, () => {

                        updated_collection.attach('attachments', {path: new_image_path}, (error) => {
                            if (error) {
                                reply(Boom.badImplementation(error));
                            } else {
                                updated_collection.save();
                                reply(updated_collection);
                            }
                        });

                    });



                } else {
                    reply(Boom.notFound());
                }
            }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }

    public deleteCollection(request: Hapi.Request, reply: Hapi.IReply) {
        let id = request.params.id;

        this.database.collectionModel.findOneAndRemove({ _id: id }).then((deleted_collection: Collection) => {
            if (deleted_collection) {
                Fs.unlink(Path.join(__dirname, '../../../', this.file_config.storage, '/collections', deleted_collection.attachments.name ));
                reply(deleted_collection);
            } else {
                reply(Boom.notFound());
            }
        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }

    public getCollectionById(request: Hapi.Request, reply: Hapi.IReply) {
        let id = request.params.id;

        this.database.collectionModel.findOne({ _id: id }).lean(true).then((collection: Collection) => {
            if (collection) {
                reply(collection);
            } else {
                reply(Boom.notFound());
            }
        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }

    public getCollections(request: Hapi.Request, reply: Hapi.IReply) {
        let limit = request.query.limit;
        let skip = request.query.skip;

        this.database.collectionModel.find({ }).lean(true).skip(skip).limit(limit).then((collections: Array<Collection>) => {
            reply(collections);
        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }

    public fileUploadCollection(request: Hapi.Request, reply: Hapi.IReply) {
        console.log('fileUpload path : ' , request.payload);

        reply(request.payload);
    }
}
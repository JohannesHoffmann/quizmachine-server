import * as Mongoose from "mongoose";
import { DataConfiguration } from "./configurations";
import {User, UserModel} from "./users/user.schema";
import {Collection, CollectionModel} from "./collections/collection.schema";


export interface Database {
    userModel: Mongoose.Model<User>;
    collectionModel: Mongoose.Model<Collection>;
}

export function init(config: DataConfiguration) {

    (<any>Mongoose).Promise = Promise;
    Mongoose.connect(config.connectionString);

    console.log("ConnectionString: ", config.connectionString);

    let mongoDb = Mongoose.connection;

    mongoDb.on("error", () => {
        console.log(`Unable to connect to database: ${config.connectionString}`);
    });

    mongoDb.once("open", () => {
        console.log(`Connected to database: ${config.connectionString}`);
    });

    return {
        collectionModel: CollectionModel,
        userModel: UserModel
    };
}
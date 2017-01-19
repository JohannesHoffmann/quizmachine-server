import * as Database from "../../src/database";
import * as Fs from "fs";
import * as Path from "path";
import * as FormData from "form-data";
import * as StreamToPromise  from "stream-to-promise";
import {Promise} from 'es6-promise';

import { Collection, CollectionModel } from "../../src/collections/collection.schema";
import * as Configs from "../../src/configurations";
import * as UserUtils from "../users/user.utils";


const filesConfig = Configs.getFilesConfigs();


export function createCollectionDummy(name?: string) {
    var collection = {
        name: name || "Collection of Questions",
        number_answers: 4,
        number_correct_answers: 1,
        question_display_mode: 'hidden',
        explanation: 'This is an explanation of the question collection mode'
    };

    return collection;
}


export function createSeedCollectionData(database: Database.Database, done: any) {
    database.userModel.create([createCollectionDummy(), createCollectionDummy('Collection of Questions 2')])
        .then((collection) => {
            done();
        })
        .catch((error) => {
            console.log(error);
        });
}


export function clearDatabase(database: Database.Database, done: any) {
    var collections = database.collectionModel.find({}).then((collections: Array<Collection>) => {
        // Delete uploaded files
        collections.forEach((elem: Collection, index: Number) => {
            Fs.unlink(Path.join(__dirname, '../../../', filesConfig.storage,'/collections', elem.attachments.name ));
        });

        // Delete database entries
        var promiseUser = database.collectionModel.remove({});

        Promise.all([promiseUser]).then(() => {
            done();
        }).catch((error) => {
            console.log(error);
        });

    });

}

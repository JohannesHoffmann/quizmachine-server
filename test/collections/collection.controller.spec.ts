import * as chai from "chai";
import * as FormData from "form-data";
import * as StreamToPromise  from "stream-to-promise";
import * as Fs from "fs";
import * as Path from "path";

import { Collection } from "../../src/collections/collection.schema";
import * as Configs from "../../src/configurations";
import * as Server from "../../src/server";
import * as Database from "../../src/database";
import * as UserUtils from "../users/user.utils";
import * as CollectionUtils from "../collections/collection.utils";

const configDb = Configs.getDatabaseConfig();
const database = Database.init(configDb);
const assert = chai.assert;
const serverConfig = Configs.getServerConfigs();
const server = Server.init(serverConfig, database);


declare let describe;
declare let it;
declare let beforeEach;
declare let afterEach;

describe("CollectionController Tests", () => {

    beforeEach((done) => {
        UserUtils.createSeedUserData(database, done);
    });

    afterEach((done) => {
        CollectionUtils.clearDatabase(database, () => {
            UserUtils.clearDatabase(database, done);
        });

    });

    it("Create a collection", (done) => {
        var user = UserUtils.createUserDummy('admin@mail.com');

        server.inject({
            method: 'POST',
            url: '/users/login',
            payload: {email: user.email, password: user.password}
        }, (res) => {
            var login: any = JSON.parse(res.payload);

            var form = new FormData();
            form.append('name', 'Collection of Questions 3');
            form.append('number_answers', 4);
            form.append('number_correct_answers', 4);
            form.append('question_display_mode', 'hidden');
            form.append('explanation', 'This is an explanation of the question collection mode');
            form.append('image', Fs.createReadStream(Path.join(__dirname, '../../../test/collections', '/testimage.png')));

            var headers = form.getHeaders();
            headers.authorization = login.token;

            StreamToPromise(form).then(function (payload) {
                server.inject({
                    method: 'POST',
                    url: '/collections',
                    payload: payload,
                    headers: headers,
                }, (res) => {
                    assert.equal(201, res.statusCode);
                    var responseBody: Collection = JSON.parse(res.payload);
                    assert.equal('Collection of Questions 3', responseBody.name);
                    Fs.access(responseBody.attachments.url, Fs.constants.R_OK | Fs.constants.W_OK, (err) => {
                        assert.equal(err, null);
                        done();
                    });
                });
            });
        });
    });

    // Not all tests written right now...



});
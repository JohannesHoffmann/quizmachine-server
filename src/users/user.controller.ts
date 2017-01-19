import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Jwt from "jsonwebtoken";
import {User} from "./user.schema";
import {UserModel} from "./user.schema";
import { Database } from "../database";
import { ServerConfigurations } from "../configurations";


export default class UserController {

    private database: Database;
    private configs: ServerConfigurations;

    /**
     * constructor.
     * @constructor
     * @param configs ServerConfigurations
     * @param database Database
     */
    constructor(configs: ServerConfigurations, database: Database) {
        this.database = database;
        this.configs = configs;
    }

    /**
     * Generate a auth token.
     * @param user
     * @returns {PromiseLike<ArrayBuffer>|number}
     */
    private generateToken(user: User) {
        const jwtSecret = this.configs.jwtSecret;
        const jwtExpiration = this.configs.jwtExpiration;
        return Jwt.sign({ id: user._id, scope: user.scope,  email: user.email }, jwtSecret, { expiresIn: jwtExpiration });
    }

    /**
     * Login user
     * @param request
     * @param reply
     */
    public loginUser(request: Hapi.Request, reply: Hapi.IReply) {
        const email = request.payload.email;
        const password = request.payload.password;

        this.database.userModel.findOne({ email: email })
            .then((user: User) => {
                if (!user) {
                    return reply(Boom.unauthorized("User does not exists."));
                }

                if (!user.validatePassword(password)) {
                    return reply(Boom.unauthorized("Password is invalid."));
                }
                const token = this.generateToken(user);

                reply({
                    token: token
                });
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public createUser(request: Hapi.Request, reply: Hapi.IReply) {
        const user: User = request.payload;

        this.database.userModel.create(user).then((user) => {
            const token = this.generateToken(user);
            reply({ token: token }).code(201);
        })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public updateUser(request: Hapi.Request, reply: Hapi.IReply) {
        const id = request.auth.credentials.id;
        const user: User = request.payload;

        this.database.userModel.findByIdAndUpdate(id, { $set: user }, { new: true })
            .then((user) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public updateUserById(request: Hapi.Request, reply: Hapi.IReply) {
        const id = request.params.id;
        const user: User = request.payload;

        this.database.userModel.findByIdAndUpdate(id, { $set: user }, { new: true })
            .then((user) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }


    public deleteUser(request: Hapi.Request, reply: Hapi.IReply) {
        const id = request.auth.credentials.id;

        this.database.userModel.findByIdAndRemove(id)
            .then((user: User) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public deleteUserById(request: Hapi.Request, reply: Hapi.IReply) {
        const id = request.params.id;

        this.database.userModel.findByIdAndRemove(id)
            .then((user: User) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }


    public infoUser(request: Hapi.Request, reply: Hapi.IReply) {
        const id = request.auth.credentials.id;

        this.database.userModel.findById(id)
            .then((user: User) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }


    public allUser(request: Hapi.Request, reply: Hapi.IReply) {

        this.database.userModel.find({})
            .then((user: User) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public getUserById(request: Hapi.Request, reply: Hapi.IReply) {
        const id = request.params.id;

        this.database.userModel.findById(id)
            .then((user: User) => {
                reply(user);
            })
            .catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }
}
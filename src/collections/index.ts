import * as Hapi from "hapi";
import Routes from "./collection.routes";
import { Database } from "../database";
import { ServerConfigurations } from "../configurations";

export function init(server: Hapi.Server, configs: ServerConfigurations, database: Database) {
    Routes(server, configs, database);
}
import * as Mongoose from "mongoose";
import * as Crate from "mongoose-crate";
import * as LocalFS from "mongoose-crate-localfs";
import * as Path from "path";
import * as Configs from "../configurations";
import {FilesConfiguration} from "../configurations/index";

declare let __dirname;
const filesConfig: FilesConfiguration = Configs.getFilesConfigs();
console.log("STORAGE: ", filesConfig);
/**
 * Creates Type Model
 */
export interface Collection extends Mongoose.Document {
    _id: string;
    name: string;
    number_answers: number;
    number_correct_answers: number;
    question_display_mode: string;
    explanation: string;
    createdAt: Date;
    updateAt: Date;
    attach: Function;
    save: Function;
    attachments: {
        name: string;
        size: number;
        type: string;
        url: string;
    };
};

/**
 * Generate Schema for Mongoose
 * @type {Mongoose.Schema}
 */
export const CollectionSchema = new Mongoose.Schema({
        name: { type: String, required: true },
        number_answers: { type: Number, required: true },
        number_correct_answers: { type: Number, required: true },
        question_display_mode: { type: String, required: true },
        explanation: { type: String, required: true }
    },
    {
        timestamps: true
    });

CollectionSchema.plugin(Crate, {
    storage: new LocalFS({
        directory: Path.join(__dirname, '../../../', filesConfig.storage, '/collections')
    }),
    fields: {
        attachments: {
            array: false
        }
    }
});

export const CollectionModel = Mongoose.model<Collection>('Collection', CollectionSchema);
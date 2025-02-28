import Database from "@dbml/core/types/model_structure/database";
import { Command } from "commander";
import { Config } from "src/config";
import DomainFormat from "src/format/data/domain";
import Formatter from "src/format/formatter";
import FileUtil from "src/util/file";
import Generator from "src/generate/generator";
import Exporter from "src/export/exporter";
import { DatabaseParser, ParseFormat } from "src/parse/parser";

const validFormats = Object.values(ParseFormat);

let generateDbml: Command = new Command('generate-dbml')
    .description('generate dbml using domain formats')
    .requiredOption("-s, --sql <type>", "sql file path", value => {
        if (!FileUtil.isFileSync(value)) {
            throw new Error('invalid sql file path');
        }
        return value;
    })
    .requiredOption("-f, --format <type>", "sql file database format (mysql, postgres, ...)", value => {
        if (!validFormats.includes(value as ParseFormat)) {
            throw new Error(`Invalid format: '${value}'. Allowed formats: ${validFormats.join(", ")}`);
        }
        return value;
    })
    .action(options => generateDbmlAction(options));

function generateDbmlAction(options: any) {
    let domainFormats: DomainFormat[] = Formatter.loadDomains({
        dir: Config.outDir, 
        formatFilename: Config.formatFilename
    });
    let database: Database = DatabaseParser.parseBySql({
        sql: options.sql,
        format: options.format
    });
    for (let domainFormat of domainFormats) {
        let generatedDatabase: Database = Generator.generateDatabase({
            model: database,
            format: domainFormat
        });
        Exporter.export({
            model: generatedDatabase,
            dir: FileUtil.join(Config.outDir, domainFormat.name),
            filename: Config.generateDbmlFilename,
            format: 'dbml'
        });
    }
}

export {
    generateDbml
};
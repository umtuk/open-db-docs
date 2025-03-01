import Database from "@dbml/core/types/model_structure/database";
import { Command } from "commander";
import { Config } from "src/config";
import DomainFormat from "src/format/data/domain";
import Formatter from "src/format/formatter";
import FileUtil from "src/util/file";
import Generator from "src/generate/generator";
import Exporter from "src/export/exporter";
import { DatabaseParser, ParseFormat } from "src/parse/parser";
import { ConnectFormat, Connector } from "src/connect/connector";
import { DatabaseSchema } from "@dbml/connector/dist/connectors/types";
import { importer } from "@dbml/core";

const validParseFormats = Object.values(ParseFormat);
const validConnectFormats = Object.values(ConnectFormat);

let generateDbml: Command = new Command('generate-dbml')
    .description('generate dbml using domain formats')
    .option("-s, --sql <type>", "sql file path", value => {

        if (value && !FileUtil.isFileSync(value)) {
            throw new Error('invalid sql file path');
        }
        return value;
    })
    .requiredOption("-f, --format <type>", "sql file database format (mysql, postgres, ...)")
    .option("-c, --connection <type>", "database connection (postgresql://dbml_user:dbml_pass@localhost:5432/dbname)")
    .action(options => generateDbmlAction(options))
    .exitOverride();

async function generateDbmlAction(options: any) {
    let domainFormats: DomainFormat[] = Formatter.loadDomains({
        dir: Config.outDir, 
        formatFilename: Config.formatFilename
    });
    let database: Database;
    if (options.sql && options.connection) {
        throw new Error('invalid args, must contain only one of sql or connection.');
    } else if (options.sql) {
        if (!validParseFormats.includes(options.format as ParseFormat)) {
            throw new Error(`Invalid format: '${options.format}'. Allowed formats: ${validParseFormats.join(", ")}`);
        }
        database = DatabaseParser.parseByFile({
            file: options.sql,
            format: options.format
        });
    } else if (options.connection) {
        if (!validConnectFormats.includes(options.format as ConnectFormat)) {
            throw new Error(`Invalid format: '${options.format}'. Allowed formats: ${validParseFormats.join(", ")}`);
        }
        let schemaJson: DatabaseSchema = await Connector.connect({
            connection: options.connection,
            format: options.format
        });
        let dbml: string = importer.generateDbml(schemaJson);
        database = DatabaseParser.parseByStr({
            str: dbml,
            format: ParseFormat.DBML
        });
    } else {
        throw new Error('invalid args,must contain only one of sql or connection.');
    }

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
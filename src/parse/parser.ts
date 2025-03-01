import { Parser } from "@dbml/core";
import Database from "@dbml/core/types/model_structure/database";
import FileUtil from "src/util/file";

const parser = new Parser();

enum ParseFormat {
    JSON = "json",
    MYSQL = "mysql",
    MYSQL_LEGACY = "mysqlLegacy",
    POSTGRES = "postgres",
    POSTGRES_LEGACY = "postgresLegacy",
    DBML = "dbml",
    DBML_V2 = "dbmlv2",
    MSSQL = "mssql",
    SCHEMALRB = "schemarb",
    SNOWFLAKE = "snowflake",
}

interface ParseByFile {
    file: string,
    format: ParseFormat
}

interface ParseByStr {
    str: string,
    format: ParseFormat
}

class DatabaseParser {
    static parseByFile(data: ParseByFile): Database {
        let str: string = FileUtil.readFileSync(data.file);
        return this.parseByStr({
            str: str,
            format: data.format
        });
    }

    static parseByStr(data: ParseByStr): Database {
        return parser.parse(data.str, data.format);
    }
}

export {
    ParseFormat,
    DatabaseParser
};
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

interface ParseBySql {
    sql: string,
    format: ParseFormat
}

class DatabaseParser {
    static parseBySql(data: ParseBySql): Database {
        let sql: string = FileUtil.readFileSync(data.sql);
        return parser.parse(sql, data.format);
    }
}

export {
    ParseFormat,
    DatabaseParser
};
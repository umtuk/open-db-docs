import { DatabaseSchema } from "@dbml/connector/dist/connectors/types";

const { connector } = require('@dbml/connector');

interface Connect {
    connection: string,
    format: ConnectFormat
}

enum ConnectFormat {
    POSTGRES = "postgres",
    MSSQL = "mssql",
    MYSQL = "mysql",
    SNOWFLAKE = "snowflake",
    BIGQUERY = "bigquery"
}

class Connector {

    static async connect(data: Connect): Promise<DatabaseSchema> {
        let connection: string = data.connection;
        let databaseType: string = data.format;
        
        return connector.fetchSchemaJson(connection, databaseType);
    }
}

export {
    ConnectFormat,
    Connector
};
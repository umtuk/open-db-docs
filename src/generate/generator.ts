import Database, { RawDatabase } from "@dbml/core/types/model_structure/database";
import Field from "@dbml/core/types/model_structure/field";
import Ref from "@dbml/core/types/model_structure/ref";
import Schema from "@dbml/core/types/model_structure/schema";
import Table from "@dbml/core/types/model_structure/table";
import DomainFormat from "src/format/data/domain";
import SchemaFormat from "src/format/data/schema";
import { FormatStrategy, ReferenceTableStrategy } from "src/format/strategy";

interface GenerateDatabase {
    model: Database,
    format: DomainFormat
}

interface GenerateSchemas {
    model: Database,
    format: DomainFormat,
}

interface GenerateTables {
    schema: Schema,
    format: SchemaFormat
}

interface GenerateRefs {
    schema: Schema,
    formatStrategy: FormatStrategy, 
    targetTables: Table[]
}

interface GenerateRefTables {
    schema: Schema, 
    formatStrategy: FormatStrategy, 
    targetTables: Table[],
    targetRefs: Ref[]
}

export default class Generator {

    static generateDatabase(data: GenerateDatabase): Database {
        let model: Database = data.model;
        let format: DomainFormat = data.format;

        let schemas: Schema[] = this.generateSchemas({
            model: model,
            format: format
        });

        let rawDatabase: RawDatabase = {
            schemas: schemas,
            tables: schemas.map(s => s.tables).flat(),
            notes: model.notes,
            enums: schemas
                .map(s => s.enums)
                .flat(),
            refs: schemas.map(s => s.refs).flat(),
            tableGroups: schemas
                .map(s => s.tableGroups)
                .flat(),
            project: {
                database_type: model.databaseType,
                name: model.name,
                note: {
                    value: model.note,
                    token: model.token
                }
            }
        };

        return new Database(rawDatabase);
    }

    private static generateSchemas(data: GenerateSchemas): Schema[] {
        return data.model.schemas
            .filter(s => data.format.schemas.some(f => f.match(s.name)))
            .map(s => Object.assign({}, s))
            .map(s => {
                let tables: Table[] = this.generateTables({
                    schema: s,
                    format: data.format.schemas.filter(f => f.match(s.name))[0]
                });
                let refs: Ref[] = this.generateRefs({
                    schema: s,
                    formatStrategy: data.format.strategy, 
                    targetTables: tables
                });
                let refTables: Table[] = this.generateRefTables({
                    schema: s, 
                    formatStrategy: data.format.strategy, 
                    targetTables: tables,
                    targetRefs: refs
                });

                s.tables = tables.concat(refTables);
                s.refs = refs;
                return s;
            })
    }

    private static generateTables(data: GenerateTables): Table[] {
        return data.schema.tables
            .filter(t => data.format.tables.some(f => f.match(t.name)))
            .map(t => Object.assign({}, t));
    }

    private static generateRefs(data: GenerateRefs): Ref[] {
        if (ReferenceTableStrategy.EXCLUDE_ALL === data.formatStrategy.referenceTableStrategy) {
            return [];
        }
        return data.schema.refs
            .filter(r => r.endpoints.some(e => data.targetTables.some(t => t.name === e.tableName)))
            .map(r => Object.assign({}, r));
    }

    private static generateRefTables(data: GenerateRefTables): Table[] {
        let referenceTableStrategy : ReferenceTableStrategy = data.formatStrategy.referenceTableStrategy;

        if (ReferenceTableStrategy.EXCLUDE_ALL === referenceTableStrategy) {
            return [];
        }

        let refTables: Table[] = data.targetRefs
            .map(r => r.endpoints).flat()
            .map(e => e.fields).flat()
            .map(f => f.table)
            .filter(t => data.targetTables.every(t2 => t2.name !== t.name))
            .map(t => Object.assign({}, t));

        if (ReferenceTableStrategy.INCLUDE_ALL_COLUMN === referenceTableStrategy) {
            return refTables;
        }

        return refTables.map(t => {
            t.fields = t.fields.filter(f => f.pk || data.targetRefs.map(r => r.endpoints).flat()
                .map(e => e.fields).flat()
                .some(f2 => {
                    f2.table.schema.name === f.table.schema.name
                        && f2.table.name === f.table.name
                        && f2.name === f.name
                }))
                .map(f => Object.assign({}, f));
            return t;
        });
    }
}
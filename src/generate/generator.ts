import Database from "@dbml/core/types/model_structure/database";
import Field from "@dbml/core/types/model_structure/field";
import Ref from "@dbml/core/types/model_structure/ref";
import Schema from "@dbml/core/types/model_structure/schema";
import Table from "@dbml/core/types/model_structure/table";
import DomainFormat from "src/format/data/domain";
import SchemaFormat from "src/format/data/schema";
import TableFormat from "src/format/data/table";
import { FormatStrategy, ReferenceTableStrategy } from "src/format/strategy";
const _ = require("lodash");

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

        let copied: Database = _.cloneDeep(model);
        copied.schemas = schemas;
        return copied;
    }

    private static generateSchemas(data: GenerateSchemas): Schema[] {
        return data.model.schemas
            .filter(s => data.format.schemas.some(f => f.match(s.name)))
            .map(s => _.cloneDeep(s))
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
            .map(t => _.cloneDeep(t));
    }

    private static generateRefs(data: GenerateRefs): Ref[] {
        let referenceTableStrategy : ReferenceTableStrategy = data.formatStrategy.referenceTableStrategy;
        let refs: Ref[] = data.schema.refs
            .filter(r => r.endpoints.some(e => data.targetTables.some(t => t.name === e.tableName)))
            .map(r => _.cloneDeep(r));
        if (ReferenceTableStrategy.EXCLUDE_ALL !== referenceTableStrategy) {
            return refs;
        }
        return refs.filter(r => r.endpoints.every(e => data.targetTables.some(t => t.name === e.tableName)));
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
            .filter(t => data.targetTables.every(targetTable => targetTable.id !== t.id))
            .map(t => _.cloneDeep(t));

        if (ReferenceTableStrategy.INCLUDE_ALL_COLUMN === referenceTableStrategy) {
            return refTables;
        }

        return refTables.map(t => {
            t.fields = t.fields.filter(f => f.pk || data.targetRefs.map(r => r.endpoints).flat()
                    .map(e => e.fields).flat()
                    .some(targetField => targetField.id === f.id)
                )
                .map(f => _.cloneDeep(f));
            t.indexes = [];
            return t;
        });
    }
}
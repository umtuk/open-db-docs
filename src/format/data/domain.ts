import { FormatStrategy, ReferenceTableStrategy } from "src/format/strategy";
import SchemaFormat from "src/format/data/schema";

class DomainFormat {
    name: string;
    strategy: FormatStrategy;
    schemas: SchemaFormat[];

    constructor(name: string, strategy?: FormatStrategy, schemas?: SchemaFormat[]) {
        this.name = name;
        this.strategy = strategy || { referenceTableStrategy : ReferenceTableStrategy.INCLUDE_PK_OR_REF_COLUMN };
        this.schemas = schemas || [];
    }

    static importFromJsonObject(obj: any): DomainFormat {
        try {
            if (typeof obj.name !== "string" 
                || typeof obj.strategy !== "object"
                || !Array.isArray(obj.schemas)) {
                throw new Error("Invalid JSON structure for DomainFormat");
            }

            const strategy = obj.strategy;
            const domain = new DomainFormat(obj.name, strategy);
            obj.schemas.forEach((s: any) => {
                domain.addSchema(SchemaFormat.importFromJsonObject(s));
            });

            return domain;
        } catch (error) {
            console.error("Failed to import DomainFormat from JSON:", error);
            throw error;
        }
    }

    addSchema(schema: SchemaFormat) {
        this.schemas.push(schema);
    }

    exportToJsonString(): string {
        return JSON.stringify(this, null, 2);
    }
}

export default DomainFormat;
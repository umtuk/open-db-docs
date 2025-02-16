import TableFormat from "src/format/data/table";
import { FormatStrategy, ReferenceTableStrategy } from "../strategy";

class DomainFormat {
    name: string;
    strategy: FormatStrategy;
    tables: TableFormat[];

    constructor(name: string, strategy?: FormatStrategy, tables?: TableFormat[]) {
        this.name = name;
        this.strategy = strategy || { referenceTableStrategy : ReferenceTableStrategy.INCLUDE_PK_OR_REF_COLUMN };
        this.tables = tables || [];
    }

    static importFromJsonObject(obj: any): DomainFormat {
        try {
            if (typeof obj.name !== "string" 
                || typeof obj.strategy !== "object"
                || !Array.isArray(obj.tables)) {
                throw new Error("Invalid JSON structure for DomainFormat");
            }

            const strategy = obj.strategy;
            const domain = new DomainFormat(obj.name, strategy);
            obj.tables.forEach((t: any) => {
                domain.addTable(TableFormat.importFromJsonObject(t));
            });

            return domain;
        } catch (error) {
            console.error("Failed to import DomainFormat from JSON:", error);
            throw error;
        }
    }

    addTable(table: TableFormat) {
        this.tables.push(table);
    }

    exportToJsonString(): string {
        return JSON.stringify(this, null, 2);
    }
}

export default DomainFormat;
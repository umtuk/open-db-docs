import TableFormat from "./table";

class SchemaFormat {
    name: string = '';
    isRegExp: boolean = false;
    tables: TableFormat[];

    constructor(name?: string, isRegExp?: boolean, columns?: TableFormat[]) {
        this.name = name || '*';
        this.isRegExp = isRegExp || true;
        this.tables = columns || [];
    }

    static importFromJsonObject(obj: any): SchemaFormat {
        if (typeof obj.name !== "string" || typeof obj.isRegExp !== "boolean" || !Array.isArray(obj.columns)) {
            throw new Error("Invalid JSON structure for SchemaFormat");
        }

        const schema = new SchemaFormat(obj.name, obj.isRegExp);
        obj.tables.forEach((t: any) => {
            schema.addTable(TableFormat.importFromJsonObject(t));
        });

        return schema;
    }

    addTable(table: TableFormat) {
        this.tables.push(table);
    }

    match(value: string): boolean {
        if (this.isRegExp) {
            return value.match(this.name) != null;
        } else {
            return this.name === value;
        }
    }
}

export default SchemaFormat;
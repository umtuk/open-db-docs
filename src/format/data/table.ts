import FieldFormat from "src/format/data/field";

class TableFormat {
    name: string = '';
    isRegExp: boolean = false;
    fields: FieldFormat[];

    constructor(name?: string, isRegExp?: boolean, columns?: FieldFormat[]) {
        this.name = name || '*';
        this.isRegExp = isRegExp || true;
        this.fields = columns || [];
    }

    static importFromJsonObject(obj: any): TableFormat {
        if (typeof obj.name !== "string" || typeof obj.isRegExp !== "boolean" || !Array.isArray(obj.columns)) {
            throw new Error("Invalid JSON structure for TableFormat");
        }

        const table = new TableFormat(obj.name, obj.isRegExp);
        obj.columns.forEach((c: any) => {
            table.addColumn(FieldFormat.importFromJsonObject(c));
        });

        return table;
    }

    addColumn(field: FieldFormat) {
        this.fields.push(field);
    }

    match(value: string): boolean {
        if (this.isRegExp) {
            return value.match(this.name) != null;
        } else {
            return this.name === value;
        }
    }
}

export default TableFormat;
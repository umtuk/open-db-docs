import ColumnFormat from "src/format/data/column";

class TableFormat {
    name: string = '';
    isRegExp: boolean = false;
    columns: ColumnFormat[];

    constructor(name?: string, isRegExp?: boolean, columns?: ColumnFormat[]) {
        this.name = name || '*';
        this.isRegExp = isRegExp || true;
        this.columns = columns || [];
    }

    static importFromJsonObject(obj: any): TableFormat {
        if (typeof obj.name !== "string" || typeof obj.isRegExp !== "boolean" || !Array.isArray(obj.columns)) {
            throw new Error("Invalid JSON structure for TableFormat");
        }

        const table = new TableFormat(obj.name, obj.isRegExp);
        obj.columns.forEach((c: any) => {
            table.addColumn(ColumnFormat.importFromJsonObject(c));
        });

        return table;
    }

    addColumn(column: ColumnFormat) {
        this.columns.push(column);
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
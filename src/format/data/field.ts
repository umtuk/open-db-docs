class FieldFormat {
    name: string;
    isRegExp: boolean = false;

    constructor(name?: string, isRegExp?: boolean) {
        this.name = name || '*';
        this.isRegExp = isRegExp || true;
    }

    static importFromJsonObject(obj: any): FieldFormat {
        if (typeof obj.name !== "string" || typeof obj.isRegExp !== "boolean") {
            throw new Error("Invalid JSON structure for FieldFormat");
        }

        return new FieldFormat(obj.name, obj.isRegExp);
    }

    match(value: string): boolean {
        if (this.isRegExp) {
            return value.match(this.name) != null;
        } else {
            return this.name === value;
        }
    }
}

export default FieldFormat;
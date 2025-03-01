import { ModelExporter } from "@dbml/core";
import Database from "@dbml/core/types/model_structure/database";
import FileUtil from "src/util/file";

type ExportFormatOption = 'dbml' | 'mysql' | 'postgres' | 'json' | 'mssql' | 'oracle';

interface Export {
    model: Database,
    dir: string, 
    filename: string,
    format: ExportFormatOption
}

export default class Exporter {
    static export(data: Export) {
        let file: string = FileUtil.join(data.dir, data.filename);
        let text: string = ModelExporter.export(data.model, data.format, false);
        FileUtil.writeFileSync(file, text);
    }
}
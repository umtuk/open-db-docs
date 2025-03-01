import DomainFormat from "src/format/data/domain";
import FileUtil from 'src/util/file';
import { ReferenceTableStrategy } from "src/format/strategy";
import SchemaFormat from "src/format/data/schema";
import TableFormat from "src/format/data/table";

interface CreateDomain {
    name: string, 
    dir: string, 
    formatFilename: string
}

interface LoadDomain {
    dir: string, 
    formatFilename: string
}

export default class Formatter {

    static createDomain(data: CreateDomain) {
        let domainDir: string = FileUtil.join(data.dir, data.name);
        if (!FileUtil.existsSync(domainDir)) {
            FileUtil.mkdirSync(domainDir, { recursive: true });
        }

        let formatFilePath: string = FileUtil.join(domainDir, data.formatFilename);
        if (FileUtil.existsSync(formatFilePath)) {
            return;
        }

        let table: TableFormat = new TableFormat();

        let schema: SchemaFormat = new SchemaFormat();
        schema.addTable(table);

        let domain: DomainFormat = new DomainFormat(
            data.name, 
            { referenceTableStrategy : ReferenceTableStrategy.INCLUDE_PK_OR_REF_COLUMN },
            [ schema ]
        );
        let jsonString = domain.exportToJsonString();
        FileUtil.writeFileSync(formatFilePath, jsonString);
    }

    static loadDomains(data: LoadDomain): DomainFormat[] {
        const domainDirs: string[] = FileUtil.readAllDiretoriesSync(data.dir);

        let domains: DomainFormat[] = [];
        for (let domainDir of domainDirs) {
            let formatFilePath: string = FileUtil.join(domainDir, data.formatFilename);
            if (FileUtil.existsSync(formatFilePath)) {
                let jsonObject: any = FileUtil.readFileAsJSONSync(formatFilePath);
                let domain: DomainFormat = DomainFormat.importFromJsonObject(jsonObject);
                domains.push(domain);
            }
        }

        return domains;
    }
}
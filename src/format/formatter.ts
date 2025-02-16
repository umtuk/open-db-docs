import Table from "@dbml/core/types/model_structure/table";
import DomainFormat from "src/format/data/domain";
import FileUtil from 'src/util/file';
import { ReferenceTableStrategy } from "./strategy";
import SchemaFormat from "./data/schema";

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

        let domain: DomainFormat = new DomainFormat(
            data.name, 
            { referenceTableStrategy : ReferenceTableStrategy.INCLUDE_PK_OR_REF_COLUMN },
            [ new SchemaFormat() ]
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
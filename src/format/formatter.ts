import Table from "@dbml/core/types/model_structure/table";
import DomainFormat from "src/format/data/domain";
import FileUtil from 'src/util/file';
import TableFormat from "./data/table";
import { ReferenceTableStrategy } from "./strategy";

export default class Formatter {

    static createDomain(name: string, dir: string, formatFilename: string) {
        let domainDir: string = FileUtil.join(dir, name);
        if (!FileUtil.existsSync(domainDir)) {
            FileUtil.mkdirSync(domainDir, { recursive: true });
        }

        let formatFilePath: string = FileUtil.join(domainDir, formatFilename);
        if (FileUtil.existsSync(formatFilePath)) {
            return;
        }

        let domain: DomainFormat = new DomainFormat(
            name, 
            { referenceTableStrategy : ReferenceTableStrategy.INCLUDE_PK_OR_REF_COLUMN },
            [ new TableFormat() ]
        );
        let jsonString = domain.exportToJsonString();
        FileUtil.writeFileSync(formatFilePath, jsonString);
    }

    static loadDomains(dir: string, formatFilename: string): DomainFormat[] {
        const domainDirs: string[] = FileUtil.readAllDiretoriesSync(dir);

        let domains: DomainFormat[] = [];
        for (let domainDir of domainDirs) {
            let formatFilePath: string = FileUtil.join(domainDir, formatFilename);
            if (FileUtil.existsSync(formatFilePath)) {
                let jsonObject: any = FileUtil.readFileAsJSONSync(formatFilePath);
                let domain: DomainFormat = DomainFormat.importFromJsonObject(jsonObject);
                domains.push(domain);
            }
        }

        return domains;
    }
}
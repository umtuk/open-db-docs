import { Command } from "commander";
import Formatter from "src/format/formatter";
import { Config } from "src/config";

let createDomain: Command = new Command('create-domain')
    .description('create default domain format')
    .requiredOption("-n, --name <type>", "domain name", value => {
        const regex = /^[A-Za-z0-9\/]+$/;
        if (!value.match(regex)) {
            throw new Error('name must contain at least one uppercase and lowercase letter, number, and / character.');
        }
        return value;
    })
    .action(options => createDomainAction(options))
    .exitOverride();

function createDomainAction(options: any) {
    Formatter.createDomain({
        name: options.name, 
        dir: Config.outDir, 
        formatFilename: Config.formatFilename
    });
}

export { createDomain };
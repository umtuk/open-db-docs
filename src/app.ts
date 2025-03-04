import { Command } from "commander";
import commands from 'src/command';

const readline = require('readline');

const program = new Command()
    .exitOverride();
commands.forEach(c => program.addCommand(c));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

program.command('exit')
    .description('exit the cli')
    .action(() => {
        console.log('Goodbye!');
        rl.close();
        process.exit(0);
});

function prompt(): void {
    rl.question('open-db-docs> ', async (input: string) => {
        const args: string[] = input.trim().split(/\s+/);
        if (args[0] === '') {
            return prompt();
        }

        try {
            await program.parseAsync(['node', 'cli', ...args]);
        } catch (err: any) {
            console.error(err.message);
        }

        prompt();
    });
}

prompt();
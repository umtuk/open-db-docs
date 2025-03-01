import { Command } from 'commander';
import { createDomain } from 'src/format/command';
import { generateDbml } from 'src/generate/command';

let commands: Command[] = [
    createDomain,
    generateDbml
]

export default [
    createDomain,
    generateDbml
];
import * as fs from 'fs';
import * as path from 'path';

export default class FileUtil {
    static existsSync(path: string): boolean {
        return fs.existsSync(path);
    }

    static join(...paths: string[]): string {
        return path.join(...paths);
    }

    static mkdirSync(path: string, options: fs.MakeDirectoryOptions) {
        fs.mkdirSync(path, options)
    }

    static readAllDiretoriesSync(dir: string): string[] {
        let dirs: string[] = [];
        dirs.push(dir);

        const subdirs: string[] = fs.readdirSync(dir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => path.join(dir, dirent.name));

        for (let subdir of subdirs) {
            Array.prototype.push.apply(dirs, this.readAllDiretoriesSync(subdir));
        }
        return dirs;
    }

    static readFileAsJSONSync(path: string): any {
        return JSON.parse(
            fs.readFileSync(path)
                .toString()
        );
    }

    static writeFileSync(file: string, data: string, options?: fs.WriteFileOptions) {
        fs.writeFileSync(file, data, options);
    }
}
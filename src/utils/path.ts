import fs from 'node:fs';
import path from 'node:path';

export function getFile(path: string) {
    const result = fs.readFileSync(path, 'utf-8')

    return result
}

export function getPath(...paths: string[]) {
    return path.join(...paths)
}
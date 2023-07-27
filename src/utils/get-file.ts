import fs from 'node:fs';

export function getFile(path: string) {
    const result = fs.readFileSync(path, 'utf-8')

    return result
}
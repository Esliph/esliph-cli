import fs from 'node:fs'
import path from 'node:path'

export function getFile(path: string) {
    try {
        const result = fs.readFileSync(path, 'utf-8')

        return result
    } catch (e) {
        console.log(e)
        return ''
    }
}

export function getPath(...paths: string[]) {
    return path.join(...paths)
}

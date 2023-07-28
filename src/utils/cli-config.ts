import { getFile, getPath } from "./path.js";

export type CliConfig = {
    module: {
        dist: string
    }
}

export function getFileCliConfig() {
    const filCliConfig: CliConfig = JSON.parse(getFile(getPath(process.cwd(), 'liph.json')))

    return filCliConfig
}
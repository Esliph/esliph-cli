import { existsSync } from 'fs'
import { join, posix } from 'path'

const localBinPathSegments = [process.cwd(), 'node_modules', '@liph', 'cli']

export function localBinExists() {
    return existsSync(join(...localBinPathSegments))
}

export function loadLocalBinCommandLoader() {
    const commandsFile = require(posix.join(...localBinPathSegments, 'commands'))
    return commandsFile.CommandLoader
}

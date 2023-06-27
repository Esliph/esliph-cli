import fs from 'node:fs'

export type CliConfig = {
    name: string
    description: string
    version: string
}
export function getCliConfig() {
    try {
        const data: CliConfig = JSON.parse(fs.readFileSync('./liph-cli.json', 'utf8'))

        return data
    } catch (err) {
        process.exit(1)
    }
}

export type PackageInfo = {
    name: string
    description: string
    version: string
}
export function getPackageInfo() {
    try {
        const data: PackageInfo = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

        return data
    } catch (err) {
        process.exit(1)
    }
}

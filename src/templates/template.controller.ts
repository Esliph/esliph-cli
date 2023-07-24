import { Result } from '@esliph/util-node'
import Handlebars from 'handlebars'
import fs from 'node:fs'

type TemplateConfig = {
    files: {
        [fileName: string]: {
            name?: string
        }
    }
}

export class TemplateControl {
    constructor(public templateName: string) {}

    execute(data: object) {
        try {
            return TemplateControl.generateTemplates(this.templateName, data)
        } catch (err: any) {
            if (err instanceof Result) {
                return Result.failure<false>(err.getError(), err.getStatus())
            }

            return Result.failure<false>({
                title: 'Generate Template',
                message: [{ message: err.message }, { message: `Cannot generate template "${this.templateName}"` }]
            })
        }
    }

    static generateTemplates(name: string, data: object) {
        const filesDirTarget = this.getTemplateFiles(name)
        const configTemplate = this.getTemplateConfig(name)

        this.writeTemplate(name, data, filesDirTarget.getValue(), configTemplate.getValue())

        return Result.success(true)
    }

    static writeTemplate(name: string, data: object, filesDirTarget: string[], configTemplate: TemplateConfig) {
        const dirTemplate: { [x: string]: string } = {}

        filesDirTarget.forEach(firTemp => {
            const fileContent = fs.readFileSync(this.getFullPathTemplateDirectoriesFile(name, firTemp), 'utf-8')

            dirTemplate[firTemp] = Handlebars.compile(fileContent)(data)

            const newName = configTemplate.files[firTemp]?.name || dirTemplate[firTemp]

            fs.writeFileSync(process.cwd() + '/examplos/' + name + '/' + newName, dirTemplate[firTemp])
        })
    }

    static getAllTemplates() {
        const templates = fs.readdirSync(this.getFullPathBase())

        return Result.success(templates.filter(temp => temp != 'template.controller.ts'))
    }

    static getTemplateConfig(name: string) {
        try {
            const configFile: TemplateConfig = JSON.parse(fs.readFileSync(this.getFullPathTemplateConfig(name), 'utf-8'))

            return Result.success<TemplateConfig>(configFile)
        } catch (err: any) {
            throw Result.failure<TemplateConfig>({
                title: 'Get Config Tamplates',
                message: [{ message: err.message }, { message: `Cannot find config template ${name}` }]
            })
        }
    }

    static getTemplateFiles(name: string) {
        try {
            const configFile = this.getTemplateConfig(name)

            const filesDirTarget = Object.keys(configFile.getValue().files).map(([key]) => key)

            return Result.success<string[]>(filesDirTarget)
        } catch (err: any) {
            return Result.failure<string[]>({
                title: 'Get Config Tamplates',
                message: [{ message: err.message }, { message: `Cannot find config template ${name}` }]
            })
        }
    }

    static getFullPathBase() {
        return `${__dirname}`
    }

    static getFullPathTemplate(name: string) {
        return `${this.getFullPathBase()}/${name}`
    }

    static getFullPathTemplateDirectories(name: string) {
        return `${this.getFullPathTemplate(name)}/directories`
    }

    static getFullPathTemplateDirectoriesFile(name: string, fileName: string) {
        return `${this.getFullPathTemplate(name)}/directories/${fileName}`
    }

    static getFullPathTemplateConfig(name: string) {
        return `${this.getFullPathTemplate(name)}/template.config.json`
    }
}

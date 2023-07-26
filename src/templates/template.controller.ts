import { Result } from '@esliph/util-node'
import Handlebars from 'handlebars'
import fs from 'node:fs'
import { TemplateConfig } from '@templates/template'
import { capitaliseTransform } from '@templates/helpers/capitalise-transform'
import { pluralTransform } from '@templates/helpers/plural-transform'
import { console } from '@utils/console'

Handlebars.registerHelper('capitalise', capitaliseTransform)
Handlebars.registerHelper('plural', pluralTransform)
Handlebars.registerHelper('capitaliseAndPlural', value => {
    return capitaliseTransform(pluralTransform(value))
})
Handlebars.registerHelper('if', function (conditional, options) {
    // @ts-expect-error
    return conditional && options.fn(this)
})

export class TemplateControl<Parameters = any> {
    constructor(public templateName: string) {}

    execute(data: Parameters) {
        try {
            return this.generateTemplates(this.templateName, data)
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

    generateTemplates(name: string, data: Parameters) {
        const filesDirTarget = this.getTemplateFiles(name)
        const configTemplate = this.getTemplateConfig(name)

        this.writeTemplate(name, data, filesDirTarget.getValue(), configTemplate.getValue())

        return Result.success(true)
    }

    writeTemplate(name: string, data: Parameters, filesDirTarget: string[], configTemplate: TemplateConfig) {
        const dirTemplate: { [x: string]: string } = {}

        filesDirTarget.forEach(firTemp => {
            try {
                const validation = configTemplate.files[firTemp]?.validation
                if (validation && !validation(data)) {
                    return
                }

                const fileContent = fs.readFileSync(this.getFullPathTemplateModelFile(name, firTemp), 'utf-8')

                dirTemplate[firTemp] = Handlebars.compile(fileContent)(data)

                const basePath = process.cwd()
                const nameConfig = configTemplate.files[firTemp]?.name
                const nameTemplateConfig = configTemplate?.nameTemplate
                const newName = typeof nameConfig == 'undefined' ? firTemp : typeof nameConfig == 'string' ? nameConfig : nameConfig(data)
                const nameTemplate =
                    typeof nameTemplateConfig == 'undefined' ? name : typeof nameTemplateConfig == 'string' ? nameTemplateConfig : nameTemplateConfig(data)
                const targetPath = 'examplos/' + nameTemplate + '/' + newName

                this.writePathFile(basePath, targetPath, dirTemplate[firTemp])
            } catch (err: any) {}
        })
    }

    writePathFile(base: string, target: string, content: string) {
        const folders = target.split('/').slice(0, target.split('/').length - 1)

        let currentFolder = base
        folders.forEach(folder => {
            currentFolder += `/${folder}`

            try {
                fs.accessSync(currentFolder, fs.constants.F_OK)
            } catch (err) {
                fs.mkdirSync(currentFolder)
            }
        })

        const pathFullTarget = base + '/' + target

        fs.writeFileSync(pathFullTarget, content)

        console.log(`${console.colorizeText('CREATED', { color: 'green' })} ${pathFullTarget}`)
    }

    getAllTemplates() {
        const templates = fs.readdirSync(this.getFullPathBase())

        return Result.success(templates.filter(temp => temp != 'template.controller.ts'))
    }

    getTemplateConfig(name: string) {
        try {
            const templateConfig = require(this.getFullPathTemplateConfig(name))

            return Result.success<TemplateConfig>(templateConfig)
        } catch (err: any) {
            throw Result.failure<TemplateConfig>({
                title: 'Get Config Tamplates',
                message: [{ message: err.message }, { message: `Cannot find config template ${name}` }]
            })
        }
    }

    getTemplateFiles(name: string) {
        try {
            const configFile = this.getTemplateConfig(name)

            const filesDirTarget = Object.keys(configFile.getValue().files).map(key => key)

            return Result.success<string[]>(filesDirTarget)
        } catch (err: any) {
            return Result.failure<string[]>({
                title: 'Get Config Tamplates',
                message: [{ message: err.message }, { message: `Cannot find config template ${name}` }]
            })
        }
    }

    getFullPathBase() {
        return `${__dirname}`
    }

    getFullPathTemplate(name: string) {
        return `${this.getFullPathBase()}/packages/${name}`
    }

    getFullPathTemplateModel(name: string) {
        return `${this.getFullPathTemplate(name)}/model`
    }

    getFullPathTemplateModelFile(name: string, fileName: string) {
        return `${this.getFullPathTemplate(name)}/model/${fileName}`
    }

    getFullPathTemplateConfig(name: string) {
        return `${this.getFullPathTemplate(name)}/template.config.ts`
    }
}

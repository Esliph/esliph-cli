import { Result } from '@esliph/util-node'
import Handlebars from 'handlebars'
import fs from 'node:fs'
import { capitaliseTransform } from './helpers/capitalise-transform.js'
import { pluralTransform } from './helpers/plural-transform.js'
import { TemplateConfig } from './template.js'
import { consoleLiph } from '../utils/console.js'
import { TEMPLATES_CONFIG } from './packages/templates.config.js'

export class TemplateControl<Parameters = any> {
    constructor(public templateName: string, public handlebars = Handlebars.create()) {
        this.globalHelpersInit()
    }

    private globalHelpersInit() {
        this.handlebars.registerHelper('capitalise', capitaliseTransform)
        this.handlebars.registerHelper('plural', pluralTransform)
        this.handlebars.registerHelper('capitaliseAndPlural', value => {
            return capitaliseTransform(pluralTransform(value))
        })
    }

    execute(data: Parameters, dist: string) {
        try {
            return this.generateTemplates(this.templateName, data, dist)
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

    generateTemplates(name: string, data: Parameters, dist: string) {
        const filesDirTarget = this.getTemplateFiles(name)
        const configTemplate = this.getTemplateConfig(name)

        this.writeTemplate(name, data, filesDirTarget.getValue(), configTemplate.getValue(), dist)

        return Result.success(true)
    }

    writeTemplate(name: string, data: Parameters, filesDirTarget: string[], configTemplate: TemplateConfig, dist: string) {
        const dirTemplate: { [x: string]: string } = {}

        filesDirTarget.forEach(firTemp => {
            try {
                if (!configTemplate.files[firTemp]) {
                    return
                }

                const validation = configTemplate.files[firTemp]?.validation
                if ((typeof validation != 'undefined' && !validation(data)) || configTemplate.files[firTemp].inactive) {
                    return
                }

                const fileContent = fs.readFileSync(this.getFullPathTemplateModelFile(name, firTemp), 'utf-8')

                dirTemplate[firTemp] = this.handlebars.compile(fileContent, {})(data)

                const nameConfig = configTemplate.files[firTemp]?.name
                const nameTemplateConfig = configTemplate?.nameTemplate
                const newName = typeof nameConfig == 'undefined' ? firTemp : typeof nameConfig == 'string' ? nameConfig : nameConfig(data)
                const nameTemplate =
                    typeof nameTemplateConfig == 'undefined' ? name : typeof nameTemplateConfig == 'string' ? nameTemplateConfig : nameTemplateConfig(data)
                const targetPath = '/' + nameTemplate + '/' + newName

                console.log(dist, targetPath)

                this.writePathFile(dist, targetPath, dirTemplate[firTemp])
            } catch (err: any) {
                console.log(err)
            }
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

        console.log(pathFullTarget)

        fs.writeFileSync(pathFullTarget, content)

        consoleLiph.log(`${consoleLiph.colorizeText('CREATED', { color: 'green' })} ${pathFullTarget}`)
    }

    getAllTemplates() {
        const templates = fs.readdirSync(this.getFullPathTemplates())

        return Result.success(templates)
    }

    getTemplateConfig(name: string) {
        try {
            return Result.success<TemplateConfig>(TEMPLATES_CONFIG[name])
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

    getFullPathTemplates() {
        return `${this.getFullPathBase()}/packages`
    }

    getFullPathTemplate(name: string) {
        return `${this.getFullPathTemplates()}/${name}`
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

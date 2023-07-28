import { Result } from '@esliph/util-node'
import Handlebars from 'handlebars'
import fs from 'node:fs'
import path from 'path'
import { capitaliseTransform } from './helpers/capitalise-transform.js'
import { pluralTransform } from './helpers/plural-transform.js'
import { TemplateConfig } from './template.js'
import { consoleLiph } from '../utils/console.js'
import { TEMPLATES_CONFIG } from './packages/templates.config.js'
import { getFile, getPath } from '../utils/path.js'

const __dirname = getPath(path.dirname(process.argv[1]), '..', 'templates')

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

                const fileContent = getFile(this.getFullPathTemplateModelFile(name, firTemp))

                dirTemplate[firTemp] = this.handlebars.compile(fileContent, {})(data)

                const nameConfig = configTemplate.files[firTemp]?.name
                const nameTemplateConfig = configTemplate?.nameTemplate
                const newName = typeof nameConfig == 'undefined' ? firTemp : typeof nameConfig == 'string' ? nameConfig : nameConfig(data)
                const nameTemplate =
                    typeof nameTemplateConfig == 'undefined' ? name : typeof nameTemplateConfig == 'string' ? nameTemplateConfig : nameTemplateConfig(data)
                const targetPath = getPath(configTemplate?.notGroupFolder ? '' : nameTemplate, newName)

                this.writePathFile(dist, targetPath, dirTemplate[firTemp])
            } catch (err: any) {
                console.log(err)
            }
        })
    }

    writePathFile(base: string, target: string, content: string) {
        const folders = [...base.split(path.sep), ...target.split(path.sep).slice(0, target.split(path.sep).length - 1)]

        let currentFolder = ''
        folders.forEach(folder => {
            currentFolder = getPath(currentFolder, folder)

            try {
                fs.accessSync(currentFolder, fs.constants.F_OK)
            } catch (err) {
                fs.mkdirSync(currentFolder)
            }
        })

        fs.writeFileSync(getPath(currentFolder, target), content)

        consoleLiph.log(`${consoleLiph.colorizeText('CREATED', { color: 'green' })} ${target}`)
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
                title: 'Get Config Templates',
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
                title: 'Get Config Templates',
                message: [{ message: err.message }, { message: `Cannot find config template ${name}` }]
            })
        }
    }

    getFullPathBase() {
        return `${__dirname}`
    }

    getFullPathTemplates() {
        return getPath(this.getFullPathBase(), '..', '..', 'templates')
    }

    getFullPathTemplate(name: string) {
        return getPath(this.getFullPathTemplates(), name)
    }

    getFullPathTemplateModelFile(name: string, fileName: string) {
        return getPath(this.getFullPathTemplate(name), fileName)
    }

    getFullPathTemplateConfig(name: string) {
        return getPath(this.getFullPathBase(), 'packages', name, 'template.config.ts')
    }
}

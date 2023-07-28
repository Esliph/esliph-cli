import { Command as CommandCli } from 'commander'
import { Command } from './command.js'
import { Prompt, Question } from '../core/prompt.js'
import { QUESTION_DEFAULT_PROPS } from '../utils/question.js'
import { consoleLiph } from '../utils/console.js'
import { TemplateControl } from '../templates/template.controller.js'
import { capitaliseTransform } from '../templates/helpers/capitalise-transform.js'
import { getFileCliConfig } from '../utils/cli-config.js'
import { getPath } from '../utils/path.js'
import path from 'path'

export type ModuleArgs = {
    name: string
    includeCrud: boolean
    isEntity: boolean
    pluralName?: string
}

export class ModuleCommand extends Command {
    async load(program: CommandCli) {
        program
            .command('module')
            .summary('Generate module')
            .aliases(['m'])
            .option('-n, --name [type]', 'Name module')
            .option('-nic, --not-include-crud', 'Not include CRUD generator')
            .option('-pn, --plural-name [type]', 'Plural name module')
            .option('-ne, --no-entity', 'Module not references a entity model')
            .action(async args => await this.action(args))
    }

    async action(args: any) {
        const dataArgs = {
            includeCrud: !args.notIncludeCrud,
            isEntity: args.entity,
            name: args.name,
            pluralName: args.pluralName
        }

        consoleLiph.log('\nGeneration new module...')

        const answers = await this.performPrompt(dataArgs)

        const data: ModuleArgs = {
            name: answers.name,
            pluralName: dataArgs.pluralName,
            includeCrud: !!dataArgs.includeCrud,
            isEntity: !!dataArgs.isEntity
        }

        const resultPerformTemplate = this.performTemplate(data)

        if (!resultPerformTemplate.isSuccess()) {
            console.log(resultPerformTemplate.getError())
            throw resultPerformTemplate.getError()
        }
    }

    private async performPrompt(args: any) {
        const promptControl = new Prompt()

        const questions: Question[] = [
            {
                ...QUESTION_DEFAULT_PROPS,
                type: 'input',
                name: 'name',
                validate: value => {
                    if (!value) {
                        return `"Name" is required`
                    }

                    if (value.split(' ').length > 1) {
                        return `"Name" cannot contain spaces`
                    }

                    return true
                },
                default: args.name,
                message: `Enter module "${consoleLiph.colorizeText('name', { styles: 'underline' })}"`
            }
        ]

        const answers = await promptControl.prompt(questions).then(res => res)

        return answers
    }

    private performTemplate(data: ModuleArgs) {
        const templateControl = new TemplateControl<ModuleArgs>('module')

        const { pluralName } = data

        if (pluralName) {
            templateControl.handlebars.unregisterHelper('plural')
            templateControl.handlebars.unregisterHelper('capitaliseAndPlural')
            templateControl.handlebars.registerHelper('plural', () => {
                return pluralName
            })
            templateControl.handlebars.registerHelper('capitaliseAndPlural', () => {
                return capitaliseTransform(pluralName)
            })
        }

        const cliConfigPAthDistModule = getPath(process.cwd(), ...getFileCliConfig().module.dist.split(path.sep))

        const resultGenerateTemplate = templateControl.execute(data, cliConfigPAthDistModule)

        return resultGenerateTemplate
    }
}

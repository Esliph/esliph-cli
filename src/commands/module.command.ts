import { Command as CommandCli } from 'commander'
import { Command } from '@commands/command'
import { TemplateControl } from '@templates/template.controller'
import { Prompt, Question } from '@core/prompt'
import { QUESTION_DEFAULT_PROPS } from '@utils/question'
import { console } from '@utils/console'

export type ModuleArgs = {
    name: string
    includeCrud: boolean
    isOperacional?: boolean
    pluralName?: boolean
}

export class ModuleCommand extends Command {
    async load(program: CommandCli) {
        program
            .command('module')
            .summary('Generate module')
            .aliases(['m'])
            .option('-n, --name [type]', 'Name module')
            .option('-ic, --include-crud <value>', 'Include CRUD generator', true)
            .option('-nic, --not-include-crud', 'Not include CRUD generator', false)
            .option('-pn, --plural-name [type]', 'Plural name module')
            .option('-op, --operational', 'If  a module operacional', false)
            .action(async args => await this.action(args))
    }

    async action(args: any) {
        const dataArgs = {
            includeCrud: !args.notIncludeCrud,
            isOperacional: args.operational,
            name: args.name,
            pluralName: args.pluralName
        }

        console.log('Generation new module...')

        const answers = await this.performPrompt(dataArgs)

        const data: ModuleArgs = {
            name: answers.name,
            pluralName: dataArgs.pluralName,
            includeCrud: dataArgs.includeCrud,
            isOperacional: dataArgs.isOperacional
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
                        return `"Name" cannot contein spaces`
                    }

                    return true
                },
                default: args.name,
                message: `Enter module "${console.colorizeText('name', { styles: 'underline' })}"`
            }
        ]

        const answers = await promptControl.prompt(questions).then(res => res)

        return answers
    }

    private performTemplate(data: ModuleArgs) {
        const templateControl = new TemplateControl<ModuleArgs>('module')

        const resultGenerateTemplete = templateControl.execute(data)

        return resultGenerateTemplete
    }
}

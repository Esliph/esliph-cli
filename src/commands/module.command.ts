import { Command as CommandCli } from 'commander'
import { Command } from '@commands/command'
import { TemplateControl } from '@templates/template.controller'
import { Prompt, Question } from '@core/prompt'
import { QUESTION_DEFAULT_PROPS } from '@utils/question'

export type ModuleArgs = {}

export class ModuleCommand extends Command {
    async load(program: CommandCli) {
        program
            .command('module')
            .summary('Generate module')
            .aliases(['m'])
            .option('-n, --name <type>', 'Name module')
            .action(async args => await this.action(args))
    }

    async action(args: any) {
        console.log('Generation new module...')
        const answers = await this.performPrompt(args)

        const data: ModuleArgs = { ...answers }

        const resultPerformTemplate = this.performTemplate(data)

        if (!resultPerformTemplate.isSuccess()) {
            console.log(resultPerformTemplate.getError())
        }
    }

    private async performPrompt(args: any) {
        const promptControl = new Prompt()

        const questions: Question[] = [
            {
                ...QUESTION_DEFAULT_PROPS,
                type: 'input',
                name: 'name'
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

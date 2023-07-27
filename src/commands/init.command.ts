import { Command as CommandCli } from 'commander'
import { Command } from './command.js'
import { TemplateControl } from '../templates/template.controller.js'
import { consoleLiph } from '../utils/console.js'

export type InitArgs = {}

export class InitCommand extends Command {
    async load(program: CommandCli) {
        program
            .command('init')
            .summary('Generate liph config')
            .aliases(['i', '-i'])
            .action(async args => await this.action(args))
    }

    async action(args: any) {
        const response = this.performTemplate(args)
        consoleLiph.log('Liph config generated')

        if (!response.isSuccess()) {
            consoleLiph.log(response.getError())
        }
    }

    private performTemplate(data: InitArgs) {
        const templateControl = new TemplateControl<InitArgs>('init')

        const resultGenerateTemplate = templateControl.execute(data, process.cwd())

        return resultGenerateTemplate
    }
}

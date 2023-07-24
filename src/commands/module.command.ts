import { Command as CommandCli } from 'commander'
import { Command } from '@commands/command'
import { TemplateControl } from '@templates/template.controller'

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
        const controlTemplate = new TemplateControl('module')

        const resultGenerateTemplete = controlTemplate.execute({ name: 'Dan Ruan' })
    }
}

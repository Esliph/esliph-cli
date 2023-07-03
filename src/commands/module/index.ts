import { Command as CommandCli } from 'commander'
import { Command } from '../../core'

export class ModuleCommand extends Command {
    constructor() {
        super({
            name: 'Module',
            action: args => {
                console.log(`Exec command "Module"`)
            }
        })

        this.on('command/start', data => this.console.log(data))
        this.on('command/end', data => this.console.log(data))
        this.on('command/error', data => this.console.error(data))
    }

    initComponents(cli: CommandCli) {
        cli.command('module')
            .summary('')
            .aliases([])
            // .argument('')
            .option('-n, --name <type>', 'Name module')
            .action(args => this.exec(args))
        // .helpOption('')
    }
}

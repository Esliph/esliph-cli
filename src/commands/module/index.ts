import { Command } from '../../core'

export class ModuleCommand extends Command {
    constructor() {
        super({
            command: {
                nameAndArgs: 'module'
            },
            alias: [],
            options: [
                {
                    flags: '-n, --name <type>',
                    description: 'Name module'
                }
            ],
            help: {
                flags: '-h, --help, help',
                description: 'Help'
            },
            action: args => {
                console.log(args)
                console.log(`Exec command "${this.command.nameAndArgs}"`)
            }
        })

        this.initComponent()
    }

    private initComponent() {}
}

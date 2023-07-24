import { Command as CommandCli } from 'commander'
import { console } from '@utils/console'
import packageConfig from '@package.json'
import { Command } from '@commands/command'

export class LiphCoreCli {
    static program: CommandCli = new CommandCli()
    private static commands: Command[] = []

    private constructor() {}

    static async factory(commands: (new () => Command)[]) {
        this.program
            .name('liph')
            .description(packageConfig.description)
            .version(packageConfig.version, '-v, --version, version')
            .usage('<command> [options]')
            .helpOption('-h, --help', 'Output usage information.')
            .showHelpAfterError('add --help for more details')
            .showSuggestionAfterError(true)
            .configureOutput({
                writeOut: mess => console.log(mess),
                outputError: mess => console.error(mess)
            })

        this.initCommands(commands)
        this.handleInvalidCommand()

        // await this.program.parseAsync(process.argv)

        this.initArgs()
    }

    private static initArgs() {
        this.program.parseAsync(process.argv)

        if (!process.argv.slice(2).length) {
            this.program.outputHelp()
        }
    }

    private static initCommands(commands: (new () => Command)[]) {
        commands.forEach(command => this.registerCommand(command))
    }

    private static handleInvalidCommand() {
        this.program.on('command:*', () => {
            console.error(`Invalid command: ${this.program.args.splice(1).join(' ')}`)
            console.log(`See "--help" for a list of available commands.\n`)
            process.exit(1)
        })
    }

    private static registerCommand(commandInstance: new () => Command) {
        const command = new commandInstance()

        command.load(this.program)

        this.commands.push(command)
    }
}

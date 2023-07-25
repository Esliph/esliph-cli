import { Command as CommandCli } from 'commander'
import { console } from '@utils/console'
import packageConfig from '@package.json'
import { Command } from '@commands/command'

export class LiphCoreCli {
    static readonly program: CommandCli = new CommandCli()
    private static commands: Command[] = []

    private constructor() {}

    static async factory(commands: (new () => Command)[]) {
        this.programConfig()
        this.initCommands(commands)
        this.initArgs()
        this.unknowCommand()
    }

    private static programConfig() {
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
    }

    private static initArgs() {
        if (!process.argv.slice(2).length) {
            return this.program.outputHelp()
        }

        this.program.parseAsync(process.argv)
    }

    private static initCommands(commands: (new () => Command)[]) {
        commands.forEach(command => this.registerCommand(command))
    }

    private static registerCommand(commandInstance: new () => Command) {
        const command = new commandInstance()

        command.load(this.program)

        this.commands.push(command)
    }

    private static unknowCommand() {}
}

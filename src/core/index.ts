import { Command as CommandCli } from 'commander'
import figlet from 'figlet'
import { Command } from '../commands/command.js'
import { consoleLiph } from '../utils/console.js'

export class LiphCoreCli {
    static readonly program: CommandCli = new CommandCli()
    private static commands: Command[] = []

    private constructor() { }

    static async factory(commands: (new () => Command)[]) {
        this.programConfig()
        this.initCommands(commands)
        this.initArgs()
        this.unknownCommand()
    }

    private static programConfig() {
        this.program
            .name('liph')
            .description('Liph is cli for development')
            .version('1.0.0', '-v, --version')
            .usage('<command> [options]')
            .helpOption('-h, --help', 'Output usage information.')
            .showHelpAfterError('add --help for more details')
            .showSuggestionAfterError(true)
            .configureOutput({
                writeOut: mess => console.log(mess),
                outputError: mess => console.error(mess)
            })

        // console.log(consoleLiph.colorizeText(figlet.textSync('Liph CLI'), { color: 'green' }))
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

    private static unknownCommand() { }
}

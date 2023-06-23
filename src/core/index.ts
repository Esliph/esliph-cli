import { ObserverEvent, ObserverListener } from '../util/observer'
import { Command as CommandCli, ParseOptions } from 'commander'
import { Console } from '../util/console'
import { Command } from './command'
import { ObserverEventLiphCli, LiphCliEvents } from '../@types/core'

export class LiphCliFactory {
    private cli: CommandCli
    private console: Console
    private observer: ObserverEventLiphCli

    constructor(commands: Command[] = []) {
        this.console = new Console({
            context: 'Core',
            config: {
                pidName: 'Liph',
                showPidCode: false
            }
        })
        this.observer = ObserverEvent<LiphCliEvents>()
        this.cli = new CommandCli()
            .name('liph')
            .description('')
            .version('1.0.0', '-v --version version')
            .showHelpAfterError('add --help for more details')
            .showSuggestionAfterError(true)
            .configureOutput({
                writeOut: mess => this.console.log(mess),
                writeErr: mess => this.console.error(mess)
            })

        commands.map(command => this.registerCommand(command))
    }

    parse(argv?: readonly string[] | undefined, options?: ParseOptions | undefined) {
        this.cli.parse(argv, options)
    }

    registerCommand(cmd: Command) {
        const c = this.cli.command(cmd.command.nameAndArgs, cmd.command.opts)
        cmd.summary && c.summary(cmd.summary)
        cmd.alias && c.aliases(cmd.alias)
        cmd.arguments && cmd.arguments.forEach(arg => c.argument(arg.flags, arg.description, arg.defaultValue))
        cmd.options && cmd.options.forEach(_cm => c.option(_cm.flags, _cm.description, _cm.defaultValue))
        cmd.hooks && cmd.hooks.forEach(hook => c.hook(hook.event, hook.listener))
        c.action(args => cmd.exec(args))
        cmd.help && c.helpOption(cmd.help.flags, cmd.help.description)

        cmd.on('command/start', mess => this.console.log(mess, { messageSameLine: true }))
        cmd.on('command/end', mess => this.console.log(mess, { messageSameLine: true }))
        cmd.on('command/error', mess => this.console.error(mess))
    }
}

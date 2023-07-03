import { Command as CommandCli } from 'commander'
import { ObserverEventModel, ObserverEvent } from '../util/observer'
import { CommandType, LiphCliEvents } from '../@types/core'
import { Console } from '../util/console'

export class Command {
    action: CommandType['action']
    protected console: Console
    protected observer: ObserverEventModel<LiphCliEvents>

    constructor(args: CommandType, console?: Console) {
        this.console = console || new Console({ context: `[Command${args.name}]`, levels: true })
        this.observer = ObserverEvent<LiphCliEvents>()
        this.action = args['action']
    }

    initComponents(cli: CommandCli) {}

    exec(...args: any[]) {
        try {
            this.observer.emit('command/start', 'Module start')
            this.action(args)
            this.observer.emit('command/end', 'Module end')
        } catch (err) {
            this.observer.emit('command/error', err)
        }
    }

    on<E extends LiphCliEvents>(evt: E, handler: (data: any) => void, main?: boolean) {
        this.observer.on(evt, handler, main)
    }
}

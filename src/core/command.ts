import { ObserverEventModel, ObserverEvent } from '../util/observer'
import { CommandType, LiphCliEvents } from '../@types/core'

export class Command {
    action: CommandType['action']
    command: CommandType['command']
    summary: CommandType['summary']
    hooks: CommandType['hooks']
    alias: CommandType['alias']
    arguments: CommandType['arguments']
    options: CommandType['options']
    help: CommandType['help']
    protected observer: ObserverEventModel<LiphCliEvents>

    constructor(args: CommandType) {
        this.observer = ObserverEvent<LiphCliEvents>()
        this.command = args['command']
        this.summary = args['summary']
        this.hooks = args['hooks']
        this.action = args['action']
        this.alias = args['alias']
        this.arguments = args['arguments']
        this.options = args['options']
        this.help = args['help']
    }

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

import { ObserverEventModel } from "../util/observer"

export type LiphCliEvents = 'error' | 'command/start' | 'command/end' | 'command/error'
export type ObserverEventLiphCli = ObserverEventModel<LiphCliEvents>

export type CommandType = {
    command: {
        nameAndArgs: string
        opts?: CommandOptions | undefined
    }
    summary?: string
    hooks?: {
        event: HookEvent
        listener: (thisCommand: CommandCli, actionCommand: CommandCli) => void | Promise<void>
    }[]
    action: (...args: any[]) => void
    alias?: string[]
    arguments?: {
        flags: string
        description: string
        fn: (value: string, previous: unknown) => unknown
        defaultValue?: unknown
    }[]
    options?: {
        flags: string
        description?: string | undefined
        defaultValue?: string | boolean | string[] | undefined
    }[]
    help?: {
        flags?: string | boolean | undefined
        description?: string | undefined
    }
}

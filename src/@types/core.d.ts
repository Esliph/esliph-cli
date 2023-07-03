import { ObserverEventModel } from "../util/observer"
import { CommandOptions } from "commander"

export type LiphCliEvents = 'error' | 'command/start' | 'command/end' | 'command/error'
export type ObserverEventLiphCli = ObserverEventModel<LiphCliEvents>

export type CommandType = {
    name: string
    action: (...args: any[]) => void
}

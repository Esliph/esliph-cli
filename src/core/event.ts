import { ObserverEvent } from '../util/observer'
import { ObserverEventLiphCli, LiphCliEvents } from '../@types/core'

class EventControl {
    private observer: ObserverEventLiphCli

    constructor() {
        this.observer = ObserverEvent<LiphCliEvents>()
    }
}

export const eventControl = new EventControl()

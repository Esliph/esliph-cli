function randomIdInt() {
    const VALUE_MAX = 9999
    const now = new Date()

    const idString = `${now.getFullYear()}${`${now.getMonth() + 1}`.padStart(2, '0')}${`${Math.floor(Math.random() * VALUE_MAX)}`.padStart(
        `${VALUE_MAX}`.length,
        '0'
    )}`

    return Number(idString)
}

export interface ObserverEventData {
    data: any
}

export type ObserverListener<Events> = {
    handler: (data: any) => void
    evt: Events
    code: number
    main?: boolean
}

export interface ObserverEventModel<Events> {
    on: <E extends Events>(evt: E, handler: (data: any) => void, main?: boolean) => number
    emit: <U extends Events>(evt: U, data: any) => Promise<void>
    removeListener: (code: number) => void
    clearListeners: (main?: boolean) => void
    listeners: ObserverListener<Events>[]
}

export function ObserverEvent<Events>(): ObserverEventModel<Events>

export function ObserverEvent<Events>(): ObserverEventModel<Events> {
    const listeners: ObserverEventModel<Events>['listeners'] = []

    const on: ObserverEventModel<Events>['on'] = <E extends Events>(evt: E, handler: (data: ObserverEventData) => void, main?: boolean) => {
        const code = randomIdInt()

        listeners.push({ evt, handler, code, main })

        return code
    }

    const emit: ObserverEventModel<Events>['emit'] = async <U extends Events>(evt: U, data: ObserverEventData) => {
        /* eslint no-async-promise-executor: ["off"] */

        await new Promise(async resolve => {
            const promises = listeners.filter(_obs => _obs.evt == evt).map(_obs => _obs.handler(data))

            await Promise.all(promises).then(resolve)
        })
    }

    const removeListener: ObserverEventModel<Events>['removeListener'] = code => {
        const index = listeners.findIndex(obs => obs.code == code)

        if (index < 0) {
            return
        }

        listeners.splice(index, 1)
    }

    const clearListeners: ObserverEventModel<Events>['clearListeners'] = main => {
        /* eslint no-unused-expressions: ["off"] */
        for (let i = listeners.length - 1; i >= 0; i--) {
            if (listeners[i].main) {
                main && listeners.splice(i, 1)

                continue
            }
            !main && listeners.splice(i, 1)
        }
    }

    return {
        on,
        emit,
        removeListener,
        listeners,
        clearListeners
    }
}

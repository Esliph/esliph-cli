import { Console as ConsoleLiph, ConsoleMethod } from '@esliph/util'

const GLOBAL_TEMPLATE_CONSOLE_METHODS = {
    log: '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <dateTime> - <method?background=blue> <context?color=green&styles=bold>: <message>',
    error: '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <dateTime> - <method?background=red> <context?color=green&styles=bold>: <message>',
    warn: '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <dateTime> - <method?background=yellow&color=black> <context?color=green&styles=bold>: <message>',
    info: '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <dateTime> - <method?background=white> <context?color=green&styles=bold>: <message>'
}

export class Console extends ConsoleLiph {
    constructor(args?: { pidName?: string; context?: string; levels?: boolean | ConsoleMethod | ConsoleMethod[] }) {
        super({
            templates: {
                // @ts-expect-error
                log: GLOBAL_TEMPLATE_CONSOLE_METHODS['log'],
                // @ts-expect-error
                error: GLOBAL_TEMPLATE_CONSOLE_METHODS['error'],
                // @ts-expect-error
                warn: GLOBAL_TEMPLATE_CONSOLE_METHODS['warn'],
                // @ts-expect-error
                info: GLOBAL_TEMPLATE_CONSOLE_METHODS['info']
            },
            methodsValue: { pidName: 'Liph', ...args },
            levels: args?.levels
        })
    }
}

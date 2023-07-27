import { Console as ConsoleEsliph } from '@esliph/util-node'

const TEMPLATES = {
    log: '<message>',
    error: '<message>',
    warn: '<message>',
    info: '<message>'
}

class Console extends ConsoleEsliph<typeof TEMPLATES.log, typeof TEMPLATES.error, typeof TEMPLATES.warn, typeof TEMPLATES.info> { }

export const consoleLiph = new Console({
    templates: {
        error: TEMPLATES.error,
        log: TEMPLATES.log,
        info: TEMPLATES.info,
        warn: TEMPLATES.warn
    }
})

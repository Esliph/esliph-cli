#!/usr/bin/env node

import { ModuleCommand } from './commands/module'
import { LiphCliFactory } from './core'
import { Console } from './util/console'

const console = new Console({
    context: '[LiphCliApplication]'
})

function App() {
    const liph = new LiphCliFactory({
        commands: [new ModuleCommand()]
    })

    liph.parse(process.argv)
}

try {
    App()
} catch (err: any) {
    console.error(err)
}

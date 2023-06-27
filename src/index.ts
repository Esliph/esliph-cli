#!/usr/bin/env node

import { LiphCliFactory } from './core'
import { ModuleCommand } from './commands/module/index'
import { Console } from './util/console'

const console = new Console({
    context: 'LiphApplication',
    pidName: 'Liph',
    showPidCode: false
})

function App() {
    const liph = new LiphCliFactory([new ModuleCommand()])

    liph.parse(process.argv)
}

try {
    App()
} catch (err: any) {
    console.error(err)
}

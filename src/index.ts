#!/usr/bin/env node

import { LiphCoreCli } from "./core/index.js"
import { InitCommand } from "./commands/init.command.js"
import { ModuleCommand } from "./commands/module.command.js"

async function bootstrap() {
    await LiphCoreCli.factory([ModuleCommand, InitCommand])
}

bootstrap()

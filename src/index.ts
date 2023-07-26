#!/usr/bin/env node

import { ModuleCommand } from "./commands/module.command.js"
import { LiphCoreCli } from "./core/index.js"


async function bootstrap() {
    await LiphCoreCli.factory([ModuleCommand])
}

bootstrap()

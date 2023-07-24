import { ModuleCommand } from '@commands/module.command'
import { LiphCoreCli } from '@core'

async function bootstrap() {
    await LiphCoreCli.factory([ModuleCommand])
}

bootstrap()

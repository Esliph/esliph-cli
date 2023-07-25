import { ModuleParameters } from '@commands/module.command'
import { TemplateConfig } from '@templates/template'

const TEMPLATE_CONFIG: TemplateConfig<ModuleParameters> = {
    files: {
        'schema.txt': {
            name: 'schema.ts'
        },
        'moduleName.module.txt': {
            name: data => `${data.name}.module.ts`
        },
        'moduleName.service.txt': {
            name: data => `${data.name}.service.ts`
        },
        'moduleName.controller.txt': {
            name: data => `${data.name}.controller.ts`
        },
        'dependencies.txt': {
            name: 'dependencies.ts'
        },
        'use-case.module.txt': {
            name: 'use-case.module.ts'
        },
        'use-case/update.use-case.txt': {
            name: 'use-case/update.use-case.ts'
        },
        'use-case/list.use-case.txt': {
            name: 'use-case/list.use-case.ts'
        },
        'use-case/find-one.use-case.txt': {
            name: 'use-case/find-one.use-case.ts'
        },
        'use-case/delete.use-case.txt': {
            name: 'use-case/delete.use-case.ts'
        },
        'use-case/create.use-case.txt': {
            name: 'use-case/create.use-case.ts'
        },
        'repository/update.repository.txt': {
            name: 'repository/update.repository.ts'
        },
        'repository/repository.txt': {
            name: 'repository/repository.ts'
        },
        'repository/find.repository.txt': {
            name: 'repository/find.repository.ts'
        },
        'repository/delete.repository.txt': {
            name: 'repository/delete.repository.ts'
        },
        'repository/create.repository.txt': {
            name: 'repository/create.repository.ts'
        }
    },
    nameTemplate: data => data.name
}

module.exports = TEMPLATE_CONFIG

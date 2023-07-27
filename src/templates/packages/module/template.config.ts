import { ModuleArgs } from "../../../commands/module.command.js"
import { TemplateConfig } from "../../template.js"

function IncludeCrud({ includeCrud }: ModuleArgs) {
    return includeCrud
}
function IsEntity({ isEntity }: ModuleArgs) {
    return isEntity
}

function ValidateCrudGeneration(data: ModuleArgs) {
    return IncludeCrud(data) && IsEntity(data)
}

export const TEMPLATE_CONFIG: TemplateConfig<ModuleArgs> = {
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
            name: 'use-case/update.use-case.ts',
            validation: ValidateCrudGeneration
        },
        'use-case/list.use-case.txt': {
            name: 'use-case/list.use-case.ts',
            validation: ValidateCrudGeneration
        },
        'use-case/find-one.use-case.txt': {
            name: 'use-case/find-one.use-case.ts',
            validation: ValidateCrudGeneration
        },
        'use-case/delete.use-case.txt': {
            name: 'use-case/delete.use-case.ts',
            validation: ValidateCrudGeneration
        },
        'use-case/create.use-case.txt': {
            name: 'use-case/create.use-case.ts',
            validation: ValidateCrudGeneration
        },
        'repository/update.repository.txt': {
            name: 'repository/update.repository.ts',
            validation: ValidateCrudGeneration
        },
        'repository/repository.txt': {
            name: 'repository/repository.ts',
            validation: IsEntity
        },
        'repository/find.repository.txt': {
            name: 'repository/find.repository.ts',
            validation: ValidateCrudGeneration
        },
        'repository/delete.repository.txt': {
            name: 'repository/delete.repository.ts',
            validation: ValidateCrudGeneration
        },
        'repository/create.repository.txt': {
            name: 'repository/create.repository.ts',
            validation: ValidateCrudGeneration
        }
    },
    nameTemplate: data => data.name
}
import { InitArgs } from "../../../commands/init.command.js"
import { TemplateConfig } from "../../template.js"

export const TEMPLATE_CONFIG: TemplateConfig<InitArgs> = {
    files: {
        'liph.txt': {
            name: 'liph.json'
        }
    },
    notGroupFolder: true
}


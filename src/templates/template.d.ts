export type TemplateConfig<Parameters = any> = {
    files: {
        [fileName: string]: {
            name?: string | ((args: Parameters) => string)
            validation?: (args: Parameters) => boolean
            inactive?: boolean
        }
    }
    nameTemplate?: string | ((args: Parameters) => string)
}

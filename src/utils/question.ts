import { Question } from "../core/prompt.js"
import { consoleLiph } from "./console.js"

export const QUESTION_DEFAULT_PROPS: Question = {
    prefix: consoleLiph.colorizeText('#', { color: 'greenLight' }),
    suffix: ':',
    transformer: value => (typeof value == 'string' ? consoleLiph.colorizeText(value, { color: 'green' }) : value),
    validate: value => !!value || 'Value required',
    pageSize: 5
}

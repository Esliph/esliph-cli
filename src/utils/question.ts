import { Question } from "../core/prompt.js"
import { console } from "./console.js"

export const QUESTION_DEFAULT_PROPS: Question = {
    prefix: console.colorizeText('#', { color: 'greenLight' }),
    suffix: ':',
    transformer: value => (typeof value == 'string' ? console.colorizeText(value, { color: 'green' }) : value),
    validate: value => !!value || 'Value required',
    pageSize: 5
}

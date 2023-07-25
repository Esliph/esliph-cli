import { console } from '@utils/console'
import { Question } from '@core/prompt'

export const QUESTION_DEFAULT_PROPS: Question = {
    prefix: console.colorizeText('#', { color: 'greenLight' }),
    suffix: ':',
    transformer: value => (typeof value == 'string' ? console.colorizeText(value, { color: 'green' }) : value),
    validate: value => !!value,
    pageSize: 5
}

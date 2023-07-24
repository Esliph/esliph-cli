import inquirer, { QuestionCollection } from 'inquirer'

export { QuestionCollection }

export class Prompt {
    private static readonly prompt = inquirer.createPromptModule({})

    async prompt<Answers>(questions: QuestionCollection<Answers>, initialAnswers?: Partial<Answers>) {
        const answers = await Prompt.prompt(questions, { ...initialAnswers })
        return answers
    }
}

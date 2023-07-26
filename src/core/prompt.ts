import inquirer, { QuestionCollection, Answers as AnswersModel } from 'inquirer'

export type Question = QuestionCollection

export class Prompt {
    private static readonly prompt = inquirer.createPromptModule({})

    async prompt<Answers extends AnswersModel>(questions: QuestionCollection<Answers>, initialAnswers?: Partial<Answers>) {
        const answers = await Prompt.prompt(questions, initialAnswers)
        return answers
    }
}

/*
type: (String) Tipo do prompt. Padrão: input - Valores possíveis: input, number, confirm, list, rawlist, expand, checkbox, password, editor
name: (String) O nome a ser usado ao armazenar a resposta no objeto de respostas (answers hash). Se o nome contiver pontos, definirá um caminho no objeto de respostas.
message: (String|Function) A pergunta a ser exibida. Se definido como uma função, o primeiro parâmetro será as respostas da sessão atual do Inquirer. Padrão: o valor de name (seguido por dois pontos).
default: (String|Number|Boolean|Array|Function) Valor(es) padrão a serem usados se nada for digitado, ou uma função que retorna o(s) valor(es) padrão. Se definido como uma função, o primeiro parâmetro será as respostas da sessão atual do Inquirer.
choices: (Array|Function) Um array de opções ou uma função que retorna um array de opções. Se definido como uma função, o primeiro parâmetro será as respostas da sessão atual do Inquirer. Os valores do array podem ser números, strings simples ou objetos contendo as propriedades name (para exibição na lista), value (para salvar no objeto de respostas) e short (para exibição após a seleção). O array de opções também pode conter um separador (Separator).
validate: (Function) Recebe a entrada do usuário e o objeto de respostas. Deve retornar true se o valor for válido e uma mensagem de erro (String) caso contrário. Se false for retornado, uma mensagem de erro padrão é fornecida.
filter: (Function) Recebe a entrada do usuário e o objeto de respostas. Retorna o valor filtrado a ser usado no programa. O valor retornado será adicionado ao objeto de respostas (Answers hash).
transformer: (Function) Recebe a entrada do usuário, o objeto de respostas e as opções do prompt, e retorna um valor transformado para exibição ao usuário. A transformação afeta apenas o que é mostrado durante a edição. Ela não modifica o objeto de respostas (Answers hash).
when: (Function, Boolean) Recebe o objeto de respostas atual do Inquirer e deve retornar true ou false dependendo se esta pergunta deve ser feita ou não. O valor também pode ser um booleano simples.
pageSize: (Number) Altera o número de linhas que serão renderizadas ao usar list, rawlist, expand ou checkbox.
prefix: (String) Altera a mensagem de prefixo padrão.
suffix: (String) Altera a mensagem de sufixo padrão.
askAnswered: (Boolean) Força a exibição da pergunta se a resposta já existir.
loop: (Boolean) Habilita a repetição da lista. Padrão: true
waitUserInput: (Boolean) Sinalizador para habilitar/desabilitar a espera pela entrada do usuário antes de abrir o editor do sistema. Padrão: true
*/

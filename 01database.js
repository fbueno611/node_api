// importamos um modulo para manipulação de arquivos do nodejs
const fs = require('fs')
const util = require('util')

//convertemos o metodo de escrita de arquivos de callback para promise
const writeFileAsync = util.promisify(fs.writeFile)
const readFileAsync = util.promisify(fs.readFile)

// dependendo de onde seu codigo é executado
// a pasta do arquivo pode dar problema
// para resolver, informamos o caminho completo corrente
const path = require('path')


class Database {
    constructor() {
        this.NOME_ARQUIVO = path.join(__dirname, 'herois.json')
    }

    async obterDados() {
        const dados = await readFileAsync(this.NOME_ARQUIVO)
        // convertemos a string do arquivo para um formato de objeto javascript
        return JSON.parse(dados.toString());
    }

    async cadastrar(heroi) {
        const dados = await this.obterDados()
        dados.push(heroi)
        // transformamos os dados em string novamente
        await writeFileAsync(this.NOME_ARQUIVO,
            JSON.stringify(dados))
    }

    async listar() {
        const dados = await this.obterDados()
        return dados;
    }

    async remover(id) {
        const dados = await this.obterDados()
        // usamos a função nativa do Javascript 
        // para filtar itens de uma lista 
        // para cada item da lista chamará uma função
        // e retornará uma nova lista, bastada
        // nas respostas com TRUE

        // esxistem duas formas de mandar uma função para executar
        // podemos chamar a function nomeFuncao () {}
        // ou podemos passar um parametro
        // seguido do => para simular o corpo

        // retiramos todos que não tenha aquele mesmo id
        const dadosFiltrados = dados
            .filter(item => item.id !== id)

        await writeFileAsync(this.NOME_ARQUIVO,
            JSON.stringify(dadosFiltrados))

        console.log('O Item foi removido')
    }

    async atualizar(id, nome) {
        const dados = await this.obterDados()

        // para iteerar em um array
        // e retornar esse mesmo array modificado
        // usamos a função map do Array
        const dadosMapeados = dados.map(item => {
            if (item.id !== id) {
                return item;
            }
            item.nome = nome;
            return item
        })

        await writeFileAsync(this.NOME_ARQUIVO,
            JSON.stringify(dadosMapeados))

    }
}

// para usar o contexto de async/await
// sem precisar adicionar o .then
// usamos uma função que se auto executa
// na prática é a mesma função MAIN
// 

// ; (async function main() {
//     const database = new Database()
//     await database
//         .cadastrar({ nome: 'Aladin2', id: 1 })
//     await database
//         .cadastrar({ nome: 'lanterna verde', id: 2 })
//     await database.remover(3)
//     await database.atualizar(2, 'Batman')

//     const dados = await database.listar()
//     console.log('dados', dados)
// })()


module.exports = Database;
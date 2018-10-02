// instalamos um modulo chamado commander
// para manipular ferramentas de linha comando
// para instalar pacote no node.js
// utilizamos o Node Package Manager (NPM)
// npm install nomeDoPacote
// npm install commander

const Commander = require('commander')
// para importar funções/modulos que estão na minha pasta
// usamos ./
// para importar modulos que são instalados
// usamos somente o nome do modulo 
const Database = require('./database')

Commander
    .version('v1.0')
    .option('-c, --cadastrar', 'Cadastrar um Heroi')
    .option('-l, --listar', 'Listar herois')
    .option('-r, --remover', 'Remover um heroi pelo id')
    .option('-a, --atualizar ', 'Atualizar nome pelo id')

    .option('-m, --id [Value]', 'id do Heroi')
    .option('-n, --nome [Value]', 'Nome do Heroi')
    .option('-i, --idade [Value]', 'Idade do heroi')
    .option('-p, --poder [Value]', 'Poder do Heroi')
    .parse(process.argv)

    ;
(async function main() {
    try {
        const heroi = {
            nome: Commander.nome,
            idade: Commander.idade,
            poder: Commander.poder
        }
        const database = new Database()
        /**
         node cli.js --cadastrar --nome "Lanterna Verde" --idade 23 --poder Anel
         */
        if (Commander.cadastrar) {
            heroi.id = Date.now()
            await database.cadastrar(heroi);
            console.log('heroi cadastrado com sucesso!');
            return;
        }

        /**
         node cli.js --listar
         */
        if (Commander.listar) {
            const resultado = await database.listar()
            console.log(resultado)
            return;
        }

        /**
         node cli.js --remover --id 1538241331257
         */
        if (Commander.remover) {
            const id = parseInt(Commander.id)
            await database.remover(id)
            console.log("item removido com sucesso!")
            return;
        }

        /**
        node cli.js --atualizar --id 1538241331257 --novoNome
        */
        if (Commander.atualizar) {
            const id = parseInt(Commander.id)
            await database.atualizar(id, heroi.nome)
            console.log("Item atualizado com sucesso!")
            return;
        }
    }
    catch (erro) {
        console.error('DEU RUIM', erro)
    }


})()

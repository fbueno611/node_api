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
const DatabaseMongoDb = require('./databaseMongoDb')

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
        DatabaseMongoDb.connect()
        /**
         node cli.js --cadastrar --nome "Demolidor" --idade 35 --poder Escuta
         */
        if (Commander.cadastrar) {
            //heroi.id = Date.now()
            const resultado = await DatabaseMongoDb.cadastrar(heroi);

            if (!!resultado._id)
                console.log('heroi cadastrado com sucesso!');
            else
                console.log('Não foi possível cadastrar')
            //informamos ao SO que o processo foi concluido com exito
            process.exit(0)
            return;
        }

        /**
         node cli.js --listar
         */
        if (Commander.listar) {
            const resultado = await DatabaseMongoDb.listar()
            console.log(resultado)
            process.exit(0)
            return;
        }

        /**
         node cli.js --remover --id 5bb0fe677229ea6332d4f60a
         */
        if (Commander.remover) {
            const resultado = await DatabaseMongoDb
                .remover({ _id: Commander.id })

            if (resultado)
                console.log("item removido com sucesso!")

            else
                console.log("Não foi possível remover")

            process.exit(0)
            return;
        }

        /**
        node cli.js --atualizar --id 5bb0fb74f3dfb561aaf1b5f2 --novoNome
        */
        if (Commander.atualizar) {
            //const id = parseInt(Commander.id)
            //await database.atualizar(id, heroi.nome)
            // limpamos as chaves do Objeto
            // com uma pequena gambirra
            const heroiString = JSON.stringify(heroi)
            const heroiJson = JSON.parse(heroiString)
            const resultado = await DatabaseMongoDb
                .atualizar(Commander.id, heroiJson)
            if (resultado)
                console.log("Item atualizado com sucesso!")
            else
                console.log("Erro ao atualizar")

            process.exit(0)
            return;
        }
    }
    catch (erro) {
        console.error('DEU RUIM', erro)
    }


})()

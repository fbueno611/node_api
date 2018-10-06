// o mongo db é um banco que funciona
// inteiramente com Javascript
// para criar tabala, registro
// tudo é manupulado a partir de comandos js
// cadas registro é um objeto js
// o mongo db cria automaticamente o database se ele não existir
// caso tentar criar um registro em uma tabala que não existir
// ele irá criar a tabela e inserir as informações

// para listar os bancos de dados disponíveis
// show databases

// para entrar no contexto de um database
// use nomeDatabase

// para criar um registro e criar uma collection
// db.nomeCollection.insert

// o mongodb é constituido por 2 processos
// -> mongod -> o serviço rodando em background
// -> mongo -> de fato para entrar e manipular o servidor

// Comandos Mongo.db
// db.personagem.insert({name: 'ALADIN'})


//WHERE - find
// db.nomeCollection.find ({name:'ALADIN'})
// db.nomeCollection.find ({}, {name: 1, _id: 0})

/*
    for(let i=0; i<= 1000; i++) {
        db.personagem.insert({ name: 'P'+ i + 'AEW' })
    }

    db.personagem.find({}, {_id: 0, name: 1}).sort({name: 1})

    db.personagem.find({}, {_id: 0, name: 1}).sort({name: -1})

    db.personagem.find({
        $or: [
            {name: 'P109AEW'}, 
            {name:'P10AEW'}
        ]
    })

    db.personagem.find({
        $and: [
            { name: 'P109AEW'},
            { _id: ObjectId("5bb0d4f9b7e1cfbb7728a16c") }
        ]
    })

    db.personagem.remove({}) //remove tudo
    db.personagem.remove({name: 'P10AEW'})

    db.personagem.count({})

    const name3 = 'P22AEW'
    db.personagem.update({name: name3}, {$set:{poder: 'Anel'}}) //altera o primeiro que achar
    db.personagem.find({name: name3})

    const name3 = 'P22AEW'
    db.personagem.update({name: name3}, {$set:{poder: 'Anel'}}, {multi: 1 } ) //altera todos que achar
    db.personagem.find({name: name3})

    db.personagem.find().pretty() // identa
*/

// o mongo permite fazer CAGADA!
// precisamos falar explicitamente o que ele deve fazer
// Para que não tenhamos problemas na aplicação
// Instalamos uma biblioteca para validar e conectar
// no banco de dados
// npm install mongoose


// Mongoose.connect('mongodb://localhost:27017/herois')
// const connection = Mongoose.connection
// connection.once('open', () => console.log('db rodando!'))

// const heroiSchema = new Schema({
//     nome: {
//         type: String,
//         required: true
//     },
//     poder: {
//         type: String,
//         required: true
//     },
//     idade: {
//         type: Number,
//         required: true
//     },
//     inseridoEm: {
//         type: Date,
//         default: new Date()
//     }
// })

// // por padrão o Certo é a coleção ser em plural - const model = Mongoose.model('personagem', heroiSchema)
// // mas caso desejar definir um nome para coleção
// // é só inserir no terceiro parametro - const model = Mongoose.model('personagem', heroiSchema, 'personagem')


// const model = Mongoose.model('personagem', heroiSchema)


// async function main() {
//     const inserir = await model.create({
//         nome: 'Superman',
//         poder: 'Superforça',
//         idade: 1000
//     })
//     console.log('resultado', inserir)
//     console.log(await model.find())
// }

// main()

const Mongoose = require('mongoose')
// importamos o modelo de validação
const Schema = require('mongoose').Schema


class DatabaseMongoDb {
    connect() {
        Mongoose.connect('mongodb://localhost:27017/herois', { useNewUrlParser: true })
        const connection = Mongoose.connection
        connection.once('open', () => console.log('db rodando!'))

        const heroiSchema = new Schema({
            nome: {
                type: String,
                required: true
            },
            poder: {
                type: String,
                required: true
            },
            idade: {
                type: Number,
                required: true
            },
            inseridoEm: {
                type: Date,
                default: new Date()
            }
        })

        // por padrão o Certo é a coleção ser em plural - const model = Mongoose.model('personagem', heroiSchema)
        // mas caso desejar definir um nome para coleção
        // é só inserir no terceiro parametro - const model = Mongoose.model('personagem', heroiSchema, 'personagem')


        const model = Mongoose
            .model('personagem', heroiSchema)

        this.personagem = model;
    }

    async cadastrar(item) {
        return this.personagem.create(item)

    }

    // no JS podemos passar parametros default
    // caso o cliente não passar nenhum parametro
    // irá usar esses para fazer a requisição
    async listar(filtro = {}, limite = 100, ignore = 0) {
        const resultado = await this.personagem
            .find(filtro, { __v: 0 })
            // limitamos a quantidade de registro
            .limit(limite)
            .skip(ignore)

        return resultado;
    }

    async atualizar(id, item) {
        const resultadoAtualizado =
            await this.personagem
                .updateOne({ _id: id }, { $set: item })

        return !!resultadoAtualizado.nModified;
    }

    async remover(filtro) {
        const removerResultado =
            await this.personagem.deleteOne(filtro)

        // if (removerResultado.n === 1)
        //     return true;
        // return false
        // 1 == true
        // 0 == false

        return !!removerResultado.n //mesmo resultado mas sem o if - mais bonito
    }
}

module.exports = new DatabaseMongoDb()

// async function main() {
//     const database = new DatabaseMongoDB()
//     database.connect()

//     // const insertItem = await database.cadastrar({
//     //     nome: 'Flash',
//     //     poder: 'Velocidade',
//     //     idade: 20
//     // })

//     //console.log(insertItem)

//     // console.log(await database.remover({
//     //     nome: 'Flash'
//     // }))
//     const resultadoAtualizar =
//         await database
//             .atualizar('5bb0eb043d47d35bb67413cf', {
//                 nome: 'Batman',
//                 poder: 'Dinheiro',
//                 idade: 40
//             })
//     console.log('resultadoAtualizar', resultadoAtualizar)
//     console.log(await database.listar({}, 5, 0))
// }

// main()



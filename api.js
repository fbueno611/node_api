/*
Quando trabalhamos com APIs REst, trabalhamos com serviços sem estados
Não temos mais sessão, não guardamos mais cookies
Trafegamos apenas chaves de autenticação e não sabemos o estado
do usuário anterior

para trabalhar com o padrão Rest, seguimos algumas especificações

AÇÃO      - Método HTTP - URL         - EXEMPLO
CADASTRAR - POST        - /herois     - POST -> /herois {name: 'nome'} 
LISTAR    - GET         - /herois     - GET -> /herois?ignore=10&limit=5
REMOVER   - DELETE      - /herois/:id - DELETE -> /herois/1 
ATUALIZAR - PATCH       - /herois/:id - PATCH /herois/1 body {name: 'nome'}
ATUALIZAR - PUT         - /herois/:id - PUT /herois/1
    body {name: 'nome', idade: 15, dataNascimento: }
    (SEMPRE OBJ COMPLETO)


- Atualizar a cor, de um produto, de um cliente
ATUALIZAR - PATCH
/customers/:id/product/:id/color


*/

// importamos um modulo nativo do Node.js para criação de serviço web

// const http = require('http')

// http.createServer((request, response) => {
//     response.end('Ola Node.js!')
// })

//     .listen(3000, () => console.log('servidor está rodando!!'))


// npm install hapi@16

/*
1o passo: Instanciar o servidor
2o passo: definir a porta
3o passo: definir a rota
4o passo: Inicializar o servidor
*/
const Database = require('./databaseMongoDb')
// sabemos que o JS acontece açgumas BIZARRICES
// e não temos tempo para ficar validando estas coisas
// para evitar validar variaveis, valores, tipos e regras
//podemos definir um conjunto de regras que serão validadas
//antes de chamar a nossa API (handler)
// npm install joi
const Joi = require('joi')

const Hapi = require('hapi')
const app = new Hapi.Server()
app.connection({ port: 4000 })

/*
Para definir uma rota, definimos uma resposta de acordo com a chamada
quando um cliente pedir a base herois, cm o metodo get,
devemos chamar uma função que retorna seu resultado
*/

async function run(app) {

    await Database.connect()
    app.route([
        {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    // podemos validar todo tipo de entrada da aplicação
                    //?nome=err = query
                    //body = payload
                    // headers = headers
                    // heris/11123123131 => params
                    //http://localhost:4000/herois?ignore=0&limite=100&nome=Demolidor
                    query: {
                        nome: Joi.string().max(100).min(1),
                        limite: Joi.number().required().max(150),
                        ignore: Joi.number().required()

                    }
                }
            },
            handler: async (request, reply) => {
                try {
                    //para pegar a query string
                    // // /herois?limit=30&ignore=0
                    // const limite = request.query.limite
                    // const ignore = request.query.ignore

                    // extrairmos somente o necessario de um variavel
                    const { limite, ignore, nome } = request.query
                    const queryContains = {
                        nome: { $regex: `.*${nome}.*`, $options: 'i' }
                    }
                    const filtro = nome ? queryContains : {}
                    // const limiteInteiro = parseInt(limite)
                    // const limiteIgnore = parseInt(ignore)
                    return reply(await Database.listar(filtro, limite, ignore))

                } catch (error) {
                    console.error('deu ruim', error)
                    return reply('deu ruim')
                }
            }
        },
        {
            path: '/herois',
            method: 'POST',
            handler: async (request, reply) => {
                try {
                    const heroi = { nome, poder, idade } = request.payload
                    const resultado = await Database.cadastrar(heroi)
                    return reply(resultado)
                } catch (error) {
                    console.error('Deu ruim', error)
                    return reply('Deu ruim')
                }
            },
            config: {
                validate: {
                    payload: {
                        nome: Joi.string().required().max(100).min(5),
                        poder: Joi.string().required().max(100).min(3),
                        idade: Joi.number().required().min(18).max(150)
                    }
                }
            }
        }
    ])

    await app.start()
    console.log('API Rodando!!!')
}

run(app)
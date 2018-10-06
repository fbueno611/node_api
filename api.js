// instalamos uma módulo pra observar alterações e 
//reiniciar a aplicação automaticamente
// sudo npm install -g nodemon
// npm i vision@4 hapi-swagger@7 inert@4
// -> vision + inert espoem um front end e arquivos estáticos
// -> hapi-swagger cria uma documentação com base nas rotas criadas

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
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')

const Database = require('./databaseMongoDb')
// sabemos que o JS acontece açgumas BIZARRICES
// e não temos tempo para ficar validando estas coisas
// para evitar validar variaveis, valores, tipos e regras
//podemos definir um conjunto de regras que serão validadas
//antes de chamar a nossa API (handler)
// npm install joi
const Joi = require('joi')
// instalamos um modulo para criar um token de autenticação
// enviamos um dado Básico de cliente (nunca coloque senha)
// nosso token poderá ser descriptografado
// mas nunca gerado novamente ou alterado
// npm install jsonwebtoken hapi-auth-jwt2@7 
const Jwt = require('jsonwebtoken')
const HapiJwt = require('hapi-auth-jwt2')

const Hapi = require('hapi')
const app = new Hapi.Server()
app.connection({ port: 4000 })

/*
Para definir uma rota, definimos uma resposta de acordo com a chamada
quando um cliente pedir a base herois, cm o metodo get,
devemos chamar uma função que retorna seu resultado
*/

async function run(app) {
    await app.register([
        Vision,
        Inert,
        {
            register: HapiSwagger,
            options: { info: { title: 'API Herois', version: 'V1.0' } }
        },
        HapiJwt
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: 'MINHA_CHAVE_SECRETA',          // Never Share your secret key
        validateFunc: (decoded, request, callback) => {
            callback(null, true)
        },            // validate function defined above
        verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm

    })

    app.auth.default('jwt')
    //Para trabalhar com o swagger
    // registramos 3 plugins
    // definimos o HapiSwagger como o padrão de plugin HapiJS

    // para expoor nossa rota para o mundo 
    // precisamos adicionar a propriedade api na configuração da rota

    await Database.connect()
    app.route([
        {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Listar herois com pagnação',
                notes: 'Deve enviar o ignore e limite para paginar',
                validate: {
                    // podemos validar todo tipo de entrada da aplicação
                    //?nome=err = query
                    //body = payload
                    // headers = headers
                    // heris/11123123131 => params
                    //http://localhost:4000/herois?ignore=0&limite=100&nome=Demolidor
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
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
                tags: ['api'],
                description: 'Criar um novo heroi',
                notes: 'Deve enviar nome, poder e idade',
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    payload: {
                        nome: Joi.string().required().max(100).min(5),
                        poder: Joi.string().required().max(100).min(3),
                        idade: Joi.number().required().min(18).max(150)
                    }
                }
            }
        },
        {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deletar um heroi por um id',
                notes: 'Deve enviar o id do heroi pela url'
            },
            handler: async (request, reply) => {
                try {
                    const { id } = request.params
                    const result = await Database.remover({ _id: id })
                    return reply(result)
                } catch (error) {
                    console.error('Deu Ruim', error)
                    return reply('Deu ruim')
                }

            }
        },
        {
            path: '/herois/{id}',
            method: 'PATCH',
            handler: async (request, reply) => {
                try {
                    const { id } = request.params
                    const heroi = { nome, poder, idade } = request.payload
                    const heroiString = JSON.stringify(heroi)
                    const heroiJson = JSON.parse(heroiString)
                    const resultado = await Database.atualizar(id, heroiJson)
                    return reply(resultado)

                } catch (error) {
                    console.error('Deu Ruim', error)
                    return reply('Deu Ruim')
                }
            },
            config: {
                tags: ['api'],
                description: 'Atualizar um heroi pelo id',
                notes: 'Deve passar o id pela url e enviar o que será atualizado: nome, poder ou idade',
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().max(100).min(5),
                        poder: Joi.string().max(100).min(3),
                        idade: Joi.number().min(18).max(150)
                    }
                }
            }

        },
        {
            path: '/login',
            method: 'POST',
            handler: (request, reply) => {
                const { usuario, senha } = request.payload
                if (usuario !== 'xuxadasilva' || senha !== 123)
                    return reply('Não pode acessar!!!')

                const token = Jwt.sign({ usuario: usuario },
                    'MINHA_CHAVE_SECRETA')

                return reply({ token })

            },
            config: {
                auth: false,
                tags: ['api'],
                description: 'Fazer login',
                validate: {
                    payload: {
                        usuario: Joi.string().required(),
                        senha: Joi.number().integer().required()
                    }
                }
            }
        }

    ])

    await app.start()
    console.log('API Rodando!!!')
}

run(app)
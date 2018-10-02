// npm -> repositorio de pacotes do nodejs
// node -> lataforma de desenvolvimento
// npm init -> para inicializar um projeto
// npm init -y -> para inicializar
// sem perguntar nada

// percebemos que trabalhar com callbacks
// pode ser trabalhoso e dificil gerenciar quando temos um 
// fluxo de dados muito grande
// e precisamos garantir o valor de cada função
// e garantir também a convenção dos callbacks

// Para gerenciar melhor as funções usamos o objeto
// PROMISE
// quando inicializamos uma Promise
// Temos o estado -> Fullfilled
// Quando uma promise acontece um problema temos o estado -> rejected
// Quando uma promise acontece o esperado temos o estado -> success / Fullfiled
//para criar um objeto promise
// recebe uma funçao com dois parametros
// 1o Resolve
// 2o Reject

// Quando precisamos consumir uam biblioteca de terceiros
// Em muitos casos ainda usam Callbacks para trabalhar
// Então podemos converter funções que seguem a Convanção
// Importamos um modulo nativo do node.js (somente no backend)
const util = require('util')
//convertemos nossas funções para promise
const obterTelefoneAsync = util.promisify(obterTelefone)


// Quando precisar lançar um erro, chamamos a reject
// Quando precisar informar que terminou, chamamos a Resolve

const minhaPromise = new Promise(function(resolve, reject){
    setTimeout(() => {
        return resolve({mensagem: 'Callback é kct'})
    }, 2000);
})

// quando precisar recuperar o estado Fullflled (ou completo)
// temos a funçao .then
// quando precisar recuperar o erro 
// temos a funçao .catch

// minhaPromise
//     .then(function(resultado){
//         return resultado.mensagem
//     })

//     .then(function(resultado){
//         console.log('Meu resultado', resultado)
//     })

//     .catch(function(erro){
//         console.log('DEU RUIM', erro)
//     })


// cenario
// Obter usuario
// Obter Endereço
// Obter Telefone
// Printar na tela


// adicionamos o parametro callback
//que poderia se chamar qualquer nome
// por padrão o callback é sempre o ultimo argumento da função
function obterUsuario(){
    return new Promise(function(resolve, reject){
        setTimeout(() => {
            return resolve( {
                id: 1,
                nome: 'Aladin',
                idade: '10',
                dataNascimento: new Date()
            })
        }, 1000);
    })
    
}

function obterEndereco(idUsuario) {
    return new Promise(function(resolve, reject) {
        setTimeout(() => {
            return resolve({
                rua:'rua dos bobos',
                numero:'0'
            }) 
        }, 1000);
    })
    
}

function obterTelefone(idUsuario, callback) {
    setTimeout(() => {
        return callback(29183901, {
            numero:'11 8909090',
            ddd:'11'
        }) 
    }, 1000);
}

// passamos uma funcao que sera executada quando o metodo terminar
// por convenção 
//quando trabalhamos com callback
//o primeiro argumento é o erro
// e o segundo o sucesso
// obterUsuario(function callback(erro, usuario){
//     console.log('Usuario', usuario)
//     if(erro){
//         throw new Error('Deu Ruim em Usuario')
//     }
//     obterEndereco(usuario.id, function callback1(erro1, endereco){
//         console.log('Endereco', endereco)
//         // no JS 0, null, undefined e vazio ===FALSE
//         if(erro){
//             throw new Error('Deu Ruim em Endereco')
//         }
//         obterTelefone(usuario.id, function callback2(erro2, telefone){
//             if(erro){
//                 throw new Error('Deu Ruim em Telefone')
//             }
//             console.log(`
//                 Nome: ${usuario.nome},
//                 Endereco: ${endereco.rua},
//                 Telefone: ${telefone.numero}
//             `)
//         })
//     })
// })


// obterUsuario()
//     .then(function (resultado){
//         return obterEndereco(resultado.id)
//                 .then(function(endereco) {
//                     return {
//                         rua: endereco.rua,
//                         numero: endereco.numero,
//                         nome: resultado.nome,
//                         id: resultado.id
//                     }
//                 }) 
//     })

//     .then(function (resultado){
//         return obterTelefoneAsync(resultado.id) 
//         .then(function(telefone){
//             return {
//                 rua: resultado.rua,
//                 nome: resultado.nome,
//                 id: resultado.id,
//                 telefone: telefone.numero
//             }
//         })
//     })

//     .then(function (resultado){
//         console.log('resultado', resultado) 
//     })


//     .catch(function(erro){
//         console.log('ERRO', erro)
//     })




//recentemente na versão ES8 do Js 
// o time do C# propos uma feature para melhorar o fluxo de operações
// Agora o mesmo fluxo que é visualizado é executado
// 1o passo -> adicionar a palavras async na assinatura da função
// isso faz a função informar que retornará um PROMISE

//2o passo é adicionar a palavra await na função que queremos
// manuular o resultado



async function main(){
    // para manupular erros de promise
    // usando async/await
    // usamos o block try/catch
    // quando algo inesperado acontece, o catch é acionado

    try {
        const usuario = await obterUsuario()
        const endereco = await obterEndereco(usuario.id)
        const telefone = await obterTelefoneAsync(usuario.id)

        console.log(`
            Nome: ${usuario.nome},
            Telefone: ${telefone.numero},
            Endereco: ${endereco.rua}
    `)
    }
    catch (error) {
        console.error('DEU RUIM', error)
    }

    
} 

main()
.then(function(resultado){
    console.log('terminou!')
})

     
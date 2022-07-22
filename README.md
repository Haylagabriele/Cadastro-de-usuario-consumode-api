# Cadastro-de-usuario-consumode-api

## Esse sistema representa um cadastro de usuário utilizando o DataBase mongoDB, e  a introdução de NodeJs + express. Utilizamos o padrão MVC , sem a utilização da View, passando a rota para cadastro de usuário com a senha Criptografada.

# Recursos e aplicativos utilizados
- Insominia
projetar e testar APIs melhores por meio do desenvolvimento de primeira especificação orientado por pipelines APIOps CI/CD.
- MongoDb
Banco de dados 
- MailTrap
Usado para caixa de e-mail fake

Rota de autenticação

	## :hammer: Instalador de pacotes
- node - v : inicializa o node
- npm - v : inicializa a versão npm instalada
- npm init -y : inicializa o arquivo Package-jason vázio na máquina
- npm install mongoose : O Mongoose fornece uma solução direta e baseada em esquema para modelar seus dados de aplicativos. Ele inclui conversão de tipo integrada, validação, criação de consulta, ganchos de lógica de negócios e muito mais.
-  npm install express : Auxiliares HTTP (redirecionamento, cache, etc)
- npm install body-parser: Retorna o middleware que apenas analisa jsone analisa as solicitações em que o Content-Typecabeçalho corresponde à type opção. Este analisador aceita qualquer codificação Unicode do corpo e suporta a inflação automática de gzipe deflatecodificações.
- npm add nodemailer
- npm add nodemailer-express-handlebars ( forma de preencher variáveis em arquivos html).


### Na pasta Models

- se encontra os campos da tabela 
- transporta o usuario com o model exports

 ## Na pasta Database
 - Criação de conexão com banco de dados, passando por parametro useMongoCliente para conectar ao mongo

 ## Na pasta authController
 - define as rotas para usuarios
 - cria um novo usuario quando ele chama a rota
 - tratamento de erro, caso ocorrar alguma falha no registro o sistema irá mostrar

 ## SRC/index.js
 - recebe o pacote através de uma constante que recebe o require express
 - pacotes body-parser, nesse caso esta importando o  pacote
 - inicia a função express(core da aplicação)
 - aplicação para que o node interprete quando enviar o api em pactote jason
 - aplicação para o pacote receba parametros via URL
 - e criação de uma nova porta ( localhost:3000)

# Autenticação

## Utilizaremo uma tecnica chamada Jason web token( JWT )
- Para que o usuário se conect no api ele vai receber um tokem de autentiação
criptografado , o back-end no node vai validar a cada requisição que o usuario enviar, ele vai receber quando o usuario receber o login. 

Rota de autenticação
## :hammer: Instalador de pacotes
- npm add jsonwebtoken

## authcontroller.js
- usamos algumas verificações para saber se realmente o email e a senha estão sendo autenticados.
- gerando um token carregando uma pasta config onde foi criado um arquivo auth.json criando uma senha md5 aleatória
- toda vez que o usuario  se logar é  gerado um novo token.
- o usuário deve fazer o login e receber em seguida o token no momento que tiver se cadastrando
- Foi criado um token tanto no registro, tanto na autenticação.
- criar uma validação do usuário 

## Config
onde é gerado uma senha MD5 aleátoria

## authController

- é necessário criar o middleware fazendo a requisição entre o controller e a parte da rota vendo se estão validos , vamos precisar validar o token e saber se realmente existe.

## middleware 
- é chamado o req, res e o next, o next só é chamado para ir para o proximo passo que é auth controller ou seja se não chamar o next conseguimos parar a aplicação e assim o usuário não segue em diante.
- realizamos alguma validações 
- coloca-se duas partes o bearer e o token
- verificação que se está realmente validando em duas partes
- verifica-se se o scheme começa com bearer e para isso vamos usar o rejex
- É chamado no projectController

## controller
- cria-se uma pasta index.js para importar todos os index.js
- carrega dois modulos o fs(carreh arquivos) e o path(carrega caminhos)
- instacia o diretório que está operando o index.js (.readdirSync(__dirname))

## Module
- Nessa pasta criou-se um arquivo chamado mailer.js que não se referencia a nenhum arquivo
- Instalação de template de email através de um pacote









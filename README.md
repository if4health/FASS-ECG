# Projeto de CloudECG

![](./img/img.png)

Aqui voce encontra o codigo fonte do servidor (back-end) do projeto _CloudECG_. _CloudECG_ é um projeto de pesquisa com apoio do [IFSul](www.ifsul.edu.br)
 
Esta aplicação está em formato API RESTful e dentro do padrão FHIR. Podendo receber requisições a partir de qualquer dispositivo com capacidade de fazer requisições HTTP. E tem a capacidade de se comunicar com aplicações no padrão FHIR. Também tem a capacidade de receber ECG's de longa duração por meio de métodos de streaming data processing.

O CloudECG tem o objetivo de receber requisições dos disponsitivos móveis desenvolvidos no projeto If4health, grupo de pesquisa o qual está inserido.


## Preliminares


Voce tem 2 formas de utilizar o servidor deste repositorio
 1. **Full Local** - Configurando todo o ambiente em sua maquina local. Nesta opcao voce vai precisar instalar todas as ferramentas e fazer o download deste repositorio. 
 2. **Docker Version** - Montando o ambiente pronto e sem fazer download. Nesta opcao voce so precisa instalar o Docker e montar a imagem do ambiente pronto diretamente da nuvem, sem fazer download.

## Requisitos
#### Full Local 
- NodeJS [https://nodejs.org/en/](https://nodejs.org/en/)
- MongoDB [https://www.mongodb.com/](https://www.mongodb.com/)
- Python 3.x [https://www.python.org/downloads/](https://www.python.org/downloads/)
- yarn [https://yarnpkg.com/package/download](https://yarnpkg.com/package/download)
- Biblioteca Python biosppy [https://biosppy.readthedocs.io/en/stable/](https://biosppy.readthedocs.io/en/stable/)
- Aplicação ECG Remoto (este repositório)

#### Docker Version
- Docker e Docker Compose [https://docs.docker.com/](https://docs.docker.com/)

#### Heroku CLI
- Heroku CLI [https://devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)


## Instalação
### Full Local
#### Node
1. Faca download deste repositorio
```sh
git clone https://github.com/if4health/CloudECG
```

2. Entre no diretório
```sh
cd CloudECG
```

3. Instale os pacotes do projeto 
```sh
npm install
```
4. Crie um arquivo chamado .env e sete as environments 
```sh
SERVER_PORT=
DB_URI=
DB_NAME=
```
5. Rode a aplicação 
```sh
npm start
```

Você pode acessar os recursos da aplicações <strong>localmente</strong> por meio do Swagger-ui: http://localhost:3000/api-docs/#/ 

#### Python
1. Instale o BiosSPy e outras bibliotecas nescessarias por meio do pip 
```sh
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py
pip install biosspy
pip install certifi
pip install request
pip install pymongo[srv]
pip install python-dotenv
```
2. Verifique a instalacao do BiosSPy
```sh
cd python_src
python test.py
```

## Utilizacao


#### Utilização


## Rotas
| Rota               | Metodo | Descricao                                                                                                  |
|--------------------|--------|------------------------------------------------------------------------------------------------------------|
| `/save_exam`       | POST   | Salva os exames no formato `{sampling_rate": 360,"resolution": 145,"labels": ["ECG"],"data": [968,870,1110,4567],	"userId": "Fulano de tal",	"title": "Ola",type": "1 NSR"}`
| `/:user/exams/:id/remove` |DELETE| Remove o Exame pelo ID
|`/:user/exams/update/:id`| GET | Faz um Update do exame pelo ID (utilizado para acresentar mais dados de ecg) exemplo: http://ecgremoto.herokuapp.com/{nome}/exams/update/{id}?data=1234 
|`/list_all`        | GET   | Lista todos os exames
|`/:user/exams/:id` | GET | Acessa o exame Pelo ID|
|`/update_exam/:id` |POST| Faz a mesma coisa que a rota `/:user/exams/update/:id`, porem é ustilizada com o metodo POST (utilizado para acresentar mais dados de ecg), exemplo: {"data":[1111, 952, 988]}. 

# Deploy
Video explicando como fazer o deploy na AWS:
https://www.youtube.com/watch?v=H6TqW3LY234&ab_channel=AndreLuisDelMestreMartins
# Projeto de CloudECG

![](./img/img.png)

Aqui você encontra o codigo fonte do servidor (back-end) do projeto _CloudECG_. _CloudECG_ é um projeto de pesquisa com apoio do [IFSul](www.ifsul.edu.br)
 
Esta aplicação está em formato API RESTful e dentro do padrão FHIR. Podendo receber requisições a partir de qualquer dispositivo com capacidade de fazer requisições HTTP. E tem a capacidade de se comunicar com aplicações no padrão FHIR. Também tem a capacidade de receber ECG's de longa duração por meio de métodos de streaming data processing.

O CloudECG tem o objetivo de receber requisições dos disponsitivos móveis desenvolvidos no projeto [If4health](https://if4health.netlify.app/), grupo de pesquisa o qual está inserido.


## Requisitos 
- NodeJS e npm [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- MongoDB [https://www.mongodb.com/](https://www.mongodb.com/)
- Python 3.x [https://www.python.org/downloads/](https://www.python.org/downloads/)
- Biblioteca Python biosppy [https://biosppy.readthedocs.io/en/stable/](https://biosppy.readthedocs.io/en/stable/)


## Instalação
### Full Local
#### Node
1. Faca download deste repositório
```sh
git clone https://github.com/if4health/CloudECG
```

2. Entre no diretório
```sh
cd CloudECG
```

3. Instale os pacotes de dependências do projeto 
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

### Segue um vídeo demonstrando a utilização do CloudECG via Postman: https://youtu.be/BdqqyPXorls

### Link para download do Postman: https://www.postman.com/downloads/

### Link das Collections do CloudECG para importação e uso: https://drive.google.com/file/d/1N2BkFbLuGMT7wzyKXHrXpb2AKlIB3LCV/view?usp=sharing

### Tutorial de como importar Collections no Postman: https://www.youtube.com/watch?v=M-qHvBhULes&t=1s&ab_channel=Testfully

# Deploy
### Video explicando como fazer o deploy na AWS: https://www.youtube.com/watch?v=H6TqW3LY234&ab_channel=AndreLuisDelMestreMartins
# Chat Websocket

## Ambiente com docker-compose
``` bash
docker-compose up -d
```

## Imagem Docker Hub
``` bash
docker pull abelgasque/chat-websocket
```

``` bash
docker run -d --name chat-websocket-container --env-file .env -p 8081:8081 abelgasque/chat-websocket
```

### Requisitos
Certifique-se de ter os seguintes requisitos instalados em seu ambiente de desenvolvimento:

- Node.js (versão 18 ou superior)
- Docker
- Git (opcional, se você quiser clonar este repositório)

### Iniciar ambiente local
1- Clone o repositório (caso não tenha feito anteriormente):
``` bash
git clone https://github.com/abelgasque/chat-websocket.git
cd chat-websocket
```

2- Instale as dependências do projeto:
``` bash
npm install
```

3- Inicie o servidor:
``` bash
npm run start
```

3- Variáveis de ambiente necessárias estão no arquivo `.env-exemple` e precisa ser renomeado para `.env`.


docker build -t chat-websocket .
docker run -d -p 8081:8081 --name container-chat-websocket chat-websocket
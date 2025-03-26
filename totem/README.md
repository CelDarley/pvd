# Sistema de Pedidos para Tablet

Sistema desenvolvido para tablets (1024x1366) que permite aos clientes fazerem pedidos e pagamentos em estabelecimentos de alimentação.

## Funcionalidades

- Visualização do cardápio
- Seleção de itens
- Opções de pagamento:
  - Cartão (Visa/Master)
  - PIX
- Gerenciamento de conta:
  - Abrir conta
  - Pedir item na conta
  - Fechar conta
- Leitura de cartão/pulseira NFC
- Feedback visual das operações

## Requisitos

- Navegador web moderno com suporte a JavaScript ES6+
- Conexão com internet para carregar recursos externos
- Dispositivo com tela de 1024x1366 (tablet)

## Instalação

1. Clone ou faça download deste repositório
2. Copie os arquivos para um servidor web
3. Acesse o sistema através do navegador

## Estrutura de Arquivos

```
totem/
├── css/
│   ├── thalamus.css    # Estilos base do sistema
│   └── style.css       # Estilos específicos do sistema
├── js/
│   ├── app.js          # Lógica principal do sistema
│   ├── produtos.js     # Dados dos produtos
│   └── pagamento.js    # Simulação do gateway de pagamento
└── index.html          # Interface principal
```

## Configuração

### Produtos
Para adicionar ou modificar produtos, edite o arquivo `js/produtos.js`. Cada produto deve seguir o formato:

```javascript
{
    id: number,
    nome: string,
    descricao: string,
    preco: number,
    imagem: string,
    categoria: string
}
```

### Gateway de Pagamento
O arquivo `js/pagamento.js` contém uma simulação do gateway de pagamento. Em um ambiente de produção, você deve:

1. Substituir as funções de simulação por chamadas reais ao seu gateway
2. Implementar a segurança necessária
3. Configurar as credenciais do gateway

## Uso

1. Cliente visualiza o cardápio
2. Seleciona os itens desejados
3. Escolhe uma das opções:
   - Pagar agora
   - Abrir conta
   - Pedir item na conta
   - Fechar conta
4. Segue as instruções na tela para completar a operação

## Segurança

- Em produção, implemente HTTPS
- Configure CORS adequadamente
- Implemente autenticação para operações sensíveis
- Proteja as credenciais do gateway de pagamento

## Suporte

Para suporte ou dúvidas, entre em contato com o desenvolvedor do sistema. 
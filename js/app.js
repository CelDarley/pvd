class SistemaPedidos {
    constructor() {
        this.gateway = new GatewayPagamento();
        this.pedidoAtual = null;
        this.pedidoEmElaboracao = [];
        this.contaAtual = null;
        this.pedidosFeitos = []; // Array para armazenar todos os pedidos
        this.inicializar();
    }

    inicializar() {
        this.carregarProdutos();
        this.configurarEventos();
        
        // Faz a transição automática para o cardápio após 3 segundos
        setTimeout(() => {
            this.mostrarTela('cardapio');
        }, 3000);
    }

    carregarProdutos() {
        // Organiza os produtos por categoria
        const sanduiches = produtos.filter(p => p.categoria === "Hambúrgueres");
        const bebidas = produtos.filter(p => p.categoria === "Bebidas");
        const sobremesas = produtos.filter(p => p.categoria === "Sobremesas");

        // Função para gerar o HTML de um produto
        const gerarHTMLProduto = (produto) => `
            <div class="produto" data-id="${produto.id}" style="cursor: pointer;">
                <div class="produto-imagem">${produto.imagem}</div>
                <div class="info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <div class="preco">R$ ${produto.preco.toFixed(2)}</div>
                </div>
            </div>
        `;

        // Carrega os produtos em suas respectivas seções
        document.getElementById('sanduiches').innerHTML = sanduiches.map(gerarHTMLProduto).join('');
        document.getElementById('bebidas').innerHTML = bebidas.map(gerarHTMLProduto).join('');
        document.getElementById('sobremesas').innerHTML = sobremesas.map(gerarHTMLProduto).join('');
    }

    configurarEventos() {
        // Evento do botão Ver conta
        document.getElementById('btn-ver-conta').addEventListener('click', () => {
            console.log('Botão Ver conta clicado');
            console.log('Itens no pedido:', this.pedidoEmElaboracao);
            this.mostrarTela('visualizar-conta');
            this.atualizarVisualizacaoConta();
        });

        // Eventos do cardápio
        document.querySelectorAll('.produto').forEach(produto => {
            produto.addEventListener('click', (e) => {
                const id = parseInt(produto.dataset.id);
                this.adicionarItem(id);
            });
        });

        // Eventos das opções
        document.querySelectorAll('[data-opcao]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const opcao = e.currentTarget.dataset.opcao;
                this.processarOpcao(opcao);
            });
        });

        // Eventos de pagamento
        document.querySelectorAll('[data-pagamento]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const metodo = e.currentTarget.dataset.pagamento;
                this.processarPagamento(metodo);
            });
        });

        // Evento de confirmação de pedido
        document.getElementById('btn-confirmar-pedido')?.addEventListener('click', () => {
            this.confirmarPedido();
        });

        // Evento do botão de avançar na tela de celular
        document.getElementById('btn-avancar-celular')?.addEventListener('click', () => {
            this.confirmarCelular();
        });

        // Evento do botão pular celular
        document.getElementById('btn-pular-celular')?.addEventListener('click', () => {
            this.mostrarTela('leitor-tag');
            this.lerTagNFC();
        });

        // Evento do botão pagar conta
        document.getElementById('btn-pagar-conta')?.addEventListener('click', () => {
            this.mostrarTela('pagamento');
        });

        // Evento do botão continuar pedindo
        const btnContinuarPedindo = document.getElementById('btn-continuar-pedindo');
        if (btnContinuarPedindo) {
            btnContinuarPedindo.addEventListener('click', () => {
                console.log('Botão continuar pedindo clicado');
                this.mostrarTela('cardapio');
            });
        } else {
            console.log('Botão continuar pedindo não encontrado');
        }

        // Evento do botão voltar ao cardápio após confirmação
        document.getElementById('btn-voltar-cardapio-confirmado')?.addEventListener('click', () => {
            this.mostrarTela('cardapio');
        });

        // Evento do botão pagar pedido
        document.getElementById('btn-pagar-pedido')?.addEventListener('click', () => {
            this.mostrarTela('pagamento');
        });

        // Evento do botão voltar ao cardápio
        document.getElementById('btn-voltar-cardapio')?.addEventListener('click', () => {
            this.mostrarTela('cardapio');
        });

        // Botão voltar na tela de pagamento
        document.getElementById('btn-voltar-pagamento')?.addEventListener('click', () => {
            this.mostrarTela('cardapio');
        });

        // Botão abrir conta no cardápio
        document.getElementById('btn-abrir-conta-cardapio')?.addEventListener('click', () => {
            this.mostrarTela('celular');
        });

        // Evento do botão acrescentar na conta
        document.getElementById('btn-acrescentar-conta')?.addEventListener('click', () => {
            this.mostrarTela('leitor-tag');
            this.lerTagNFCAdicionarConta();
        });

        // Evento do botão confirmar pagamento
        document.getElementById('btn-confirmar-pagamento')?.addEventListener('click', async () => {
            const receberContaCelular = document.getElementById('receber-conta-celular').checked;
            const valor = this.calcularTotal();
            const pagamento = await this.gateway.processarCartao(valor);
            
            if (receberContaCelular && this.contaAtual?.celular) {
                // Envia a conta para o celular
                await this.gateway.enviarContaCelular(this.contaAtual.celular, this.pedidoAtual);
            }
            
            this.mostrarFeedbackPagamento(pagamento);
        });

        // Evento do botão cancelar pagamento
        document.getElementById('btn-cancelar-pagamento')?.addEventListener('click', () => {
            this.mostrarTela('pagamento');
        });

        // Evento do botão confirmar pagamento PIX
        document.getElementById('btn-confirmar-pix')?.addEventListener('click', async () => {
            const receberContaCelular = document.getElementById('receber-conta-celular-pix').checked;
            
            if (receberContaCelular && this.contaAtual?.celular) {
                // Envia a conta para o celular
                await this.gateway.enviarContaCelular(this.contaAtual.celular, this.pedidoAtual);
            }
            
            this.mostrarFeedbackPagamento({ sucesso: true, mensagem: 'Pagamento realizado com sucesso!' });
        });

        // Evento do botão cancelar pagamento PIX
        document.getElementById('btn-cancelar-pix')?.addEventListener('click', () => {
            this.mostrarTela('pagamento');
        });

        // Evento para o ícone de casa
        document.querySelectorAll('.icone-casa').forEach(icone => {
            icone.addEventListener('click', (e) => {
                e.preventDefault();
                this.mostrarTela('cardapio');
            });
        });

        // Evento do botão ir para o cardápio na tela inicial
        document.getElementById('btn-ir-cardapio')?.addEventListener('click', () => {
            // Desabilita o botão para evitar múltiplos cliques
            const btn = document.getElementById('btn-ir-cardapio');
            btn.disabled = true;
            btn.textContent = 'Carregando...';
            
            // Espera 3 segundos antes de mostrar o cardápio
            setTimeout(() => {
                this.mostrarTela('cardapio');
            }, 3000);
        });

        // Evento do botão voltar ao cardápio na tela de confirmação
        document.getElementById('btn-voltar-confirmacao')?.addEventListener('click', () => {
            this.mostrarTela('cardapio');
        });

        // Eventos dos botões de quantidade
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-quantidade')) {
                const acao = e.target.dataset.acao;
                const input = e.target.parentElement.querySelector('.input-quantidade');
                const valorAtual = parseInt(input.value);
                
                if (acao === 'aumentar') {
                    input.value = valorAtual + 1;
                } else if (acao === 'diminuir' && valorAtual > 1) {
                    input.value = valorAtual - 1;
                }
                
                // Atualiza a quantidade e o valor total no pedido atual
                if (this.pedidoAtual) {
                    this.pedidoAtual.quantidade = parseInt(input.value);
                    this.pedidoAtual.valorTotal = this.pedidoAtual.preco * this.pedidoAtual.quantidade;
                    this.atualizarListaPedido();
                    this.atualizarValorTotalDetalhes();
                }
            }
        });

        // Evento de mudança no input de quantidade
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('input-quantidade')) {
                const valor = parseInt(e.target.value);
                if (valor < 1) {
                    e.target.value = 1;
                }
                
                // Atualiza a quantidade e o valor total no pedido atual
                if (this.pedidoAtual) {
                    this.pedidoAtual.quantidade = parseInt(e.target.value);
                    this.pedidoAtual.valorTotal = this.pedidoAtual.preco * this.pedidoAtual.quantidade;
                    this.atualizarListaPedido();
                    this.atualizarValorTotalDetalhes();
                }
            }
        });

        // Evento para o botão finalizar pedido
        document.getElementById('btn-finalizar-pedido').addEventListener('click', () => {
            if (this.pedidoEmElaboracao.length > 0) {
                // Gera um número aleatório para o pedido (entre 100 e 999)
                const numeroPedido = Math.floor(Math.random() * 900) + 100;
                
                // Mostra a modal de confirmação
                const modal = document.getElementById('modal-confirmacao');
                document.getElementById('numero-pedido-modal').textContent = numeroPedido;
                modal.style.display = 'flex';
                
                // Após 3 segundos, esconde a modal e mostra o status do pedido
                setTimeout(() => {
                    modal.style.display = 'none';
                    this.atualizarStatusPedido(numeroPedido);
                    
                    // Limpa os itens do pedido em elaboração
                    this.pedidoEmElaboracao = [];
                    this.atualizarPedidoEmElaboracao();
                }, 3000);
            }
        });

        // Evento do botão adicionar ao pedido
        document.getElementById('btn-adicionar-pedido')?.addEventListener('click', () => {
            if (this.pedidoAtual) {
                // Adiciona o item ao pedido em elaboração
                this.pedidoEmElaboracao.push(this.pedidoAtual);
                
                // Atualiza a visualização do pedido na coluna da esquerda
                this.atualizarPedidoEmElaboracao();
                
                // Limpa o pedido atual
                this.pedidoAtual = null;
                
                // Volta para a tela do cardápio
                this.mostrarTela('cardapio');
            }
        });
    }

    adicionarItem(id) {
        const produto = produtos.find(p => p.id === id);
        if (!produto) {
            console.error('Produto não encontrado:', id);
            return;
        }

        // Verifica se os elementos existem antes de tentar acessá-los
        const elementos = {
            imagem: document.getElementById('imagem-produto-selecionado'),
            nome: document.getElementById('nome-produto-selecionado'),
            descricao: document.getElementById('descricao-produto-selecionado'),
            preco: document.getElementById('preco-produto-selecionado'),
            valorTotal: document.getElementById('valor-total-produto')
        };

        // Verifica se todos os elementos necessários existem
        const elementosFaltantes = Object.entries(elementos)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (elementosFaltantes.length > 0) {
            console.error('Elementos necessários não encontrados:', elementosFaltantes);
            return;
        }

        // Preenche as informações do produto na tela
        elementos.imagem.innerHTML = produto.imagem;
        elementos.nome.textContent = produto.nome;
        elementos.descricao.textContent = produto.descricao;
        elementos.preco.textContent = produto.preco.toFixed(2);
        elementos.valorTotal.textContent = produto.preco.toFixed(2);

        // Adiciona o produto ao pedido com as opções padrão
        this.pedidoAtual = {
            ...produto,
            quantidade: 1,
            opcoes: [],
            valorTotal: produto.preco // Inicializa o valor total com o preço do produto
        };

        console.log('Pedido atual criado:', this.pedidoAtual);

        // Mostra a tela de confirmação do produto
        this.mostrarTela('confirmacao-pedido');
        this.atualizarDetalhesProduto(produto);
    }

    processarOpcao(opcao) {
        switch (opcao) {
            case 'abrir-conta':
                this.mostrarTela('celular');
                break;
            case 'pagar-agora':
                this.mostrarTela('confirmacao-pedido');
                this.atualizarListaPedido();
                break;
            case 'pedir-conta':
                this.mostrarTela('leitor-tag');
                this.lerTagNFC();
                break;
            case 'fechar-conta':
                this.mostrarTela('leitor-tag');
                this.lerTagNFC();
                break;
        }
    }

    async processarPagamento(metodo) {
        if (metodo === 'cartao') {
            // Mostra a tela do leitor de cartão
            this.mostrarTela('leitor-cartao');
            
            // Simula a leitura do cartão após 3 segundos
            setTimeout(() => {
                // Preenche os dados do cartão na tela de confirmação
                document.getElementById('bandeira-cartao').src = 'https://raw.githubusercontent.com/mozdevs/gamedev-js-sprites/master/tutorial_canvas_animation/walk-right.png';
                document.getElementById('numero-cartao').textContent = '**** **** **** 1234';
                document.getElementById('titular-cartao').textContent = 'JOÃO DA SILVA';
                document.getElementById('valor-total-cartao').textContent = this.calcularTotal().toFixed(2);
                
                // Mostra a tela de confirmação do cartão
                this.mostrarTela('confirmacao-cartao');
            }, 3000);
        } else if (metodo === 'pix') {
            // Mostra a tela do PIX
            this.mostrarTela('pix');
            
            // Calcula o valor total
            const valor = this.calcularTotal();
            
            // Gera o QR code
            const qrcode = this.gateway.gerarQRCode(valor);
            
            // Atualiza o conteúdo da tela
            const mainElement = document.querySelector('#pix main');
            mainElement.innerHTML = `
                <div class="central">
                    <div class="bloco">
                        <div id="qrcode">
                            <img src="${qrcode}" alt="QR Code PIX">
                        </div>
                        <div class="mensagem-qrcode">Leia o QRcode para pagar</div>
                        <div class="total">Total: R$ ${valor.toFixed(2)}</div>
                    </div>
                </div>
            `;
            
            // Após 3 segundos, volta para o cardápio
            setTimeout(() => {
                this.mostrarTela('cardapio');
            }, 3000);
        }
    }

    async verificarPagamentoPIX() {
        // Simula um pagamento bem-sucedido
        const resultado = {
            sucesso: true,
            dados: {
                titular: 'Cliente PIX',
                valor: this.calcularTotal()
            }
        };

        // Preenche os dados do pagamento na tela de confirmação
        document.getElementById('titular-pix').textContent = resultado.dados.titular;
        document.getElementById('valor-total-pix').textContent = resultado.dados.valor.toFixed(2);
        
        // Mostra a tela de confirmação
        this.mostrarTela('confirmacao-pix');

        // Após 3 segundos, volta para o cardápio
        setTimeout(() => {
            this.mostrarTela('cardapio');
        }, 3000);
    }

    mostrarFeedbackPagamento(resultado) {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${resultado.sucesso ? 'sucesso' : 'erro'}`;
        feedback.textContent = resultado.mensagem;
        document.querySelector('.container').appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
            if (resultado.sucesso) {
                this.limparPedido();
                this.mostrarTela('cardapio');
            } else {
                this.mostrarTela('cardapio');
            }
        }, 3000);
    }

    async lerTagNFC() {
        const resultado = await this.gateway.lerTagNFC();
        if (resultado.sucesso) {
            if (!this.contaAtual) {
                // Se não tem conta, é um novo pedido
                this.contaAtual = { ...resultado.dados };
                const nomeCliente = this.contaAtual.nome ? this.contaAtual.nome : 'Cliente';
                this.mostrarFeedback(`A conta de ${nomeCliente} foi criada. Já pode usar seu cartão ou pulseira para pedidos`);
                this.mostrarTela('cardapio');
            } else {
                // Se já tem conta, é um pedido adicional
                this.mostrarFeedback("Conta identificada");
                this.mostrarTela('confirmacao-pedido');
                this.atualizarListaPedido();
            }
        }
    }

    async lerTagNFCAdicionarConta() {
        const resultado = await this.gateway.lerTagNFC();
        if (resultado.sucesso) {
            // Formata a descrição dos itens
            const descricaoItens = this.pedidoAtual.opcoes.map(opcao => opcao).join(', ');

            this.mostrarFeedback(`Acrescentado na conta os itens: ${descricaoItens}`);
            this.limparPedido();
            this.mostrarTela('cardapio');
        }
    }

    async lerTagNFCVerConta() {
        const resultado = await this.gateway.lerTagNFC();
        if (resultado.sucesso) {
            this.contaAtual = { ...resultado.dados };
            this.mostrarTela('visualizar-conta');
            this.atualizarVisualizacaoConta();
        }
    }

    atualizarListaPedido() {
        // Atualiza o total
        document.getElementById('valor-total-pedido').textContent = this.calcularTotal().toFixed(2);

        // Configura os eventos das opções
        document.querySelectorAll('.opcao input[type="checkbox"]').forEach(checkbox => {
            checkbox.onchange = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const item = this.pedidoAtual;
                if (!item) return;

                // Remove a opção se já existir
                const opcaoIndex = item.opcoes.indexOf(e.target.nextElementSibling.textContent);
                if (opcaoIndex > -1) {
                    item.opcoes.splice(opcaoIndex, 1);
                } else {
                    // Adiciona a opção se não existir
                    item.opcoes.push(e.target.nextElementSibling.textContent);
                }

                this.atualizarListaPedido();
            };
        });
    }

    calcularTotal() {
        return this.pedidoEmElaboracao.reduce((total, item) => {
            if (item && typeof item.preco === 'number' && typeof item.quantidade === 'number') {
                return total + (item.preco * item.quantidade);
            }
            return total;
        }, 0);
    }

    confirmarPedido() {
        if (this.pedidoAtual) {
            console.log('Confirmando pedido:', this.pedidoAtual);
            
            // Cria uma cópia do pedido atual com o valor total calculado
            const itemPedido = {
                ...this.pedidoAtual,
                valorTotal: this.pedidoAtual.preco * this.pedidoAtual.quantidade
            };
            
            // Adiciona o item ao pedido em elaboração
            this.pedidoEmElaboracao.push(itemPedido);
            
            // Atualiza a visualização do pedido na coluna da esquerda
            this.atualizarPedidoEmElaboracao();
            
            // Limpa o pedido atual
            this.pedidoAtual = null;
            
            // Volta para a tela do cardápio
            this.mostrarTela('cardapio');
            
            console.log('Pedido em elaboração atualizado:', this.pedidoEmElaboracao);
        }
    }

    limparPedido() {
        this.pedidoAtual = null;
        this.pedidoEmElaboracao = [];
        this.pedidosFeitos = []; // Limpa também os pedidos feitos
    }

    mostrarFeedback(mensagem) {
        const feedback = document.createElement('div');
        feedback.className = 'feedback sucesso';
        feedback.textContent = mensagem;
        document.querySelector('.container').appendChild(feedback);
        setTimeout(() => feedback.remove(), 3000);
    }

    mostrarTela(id) {
        // Remove a classe ativo de todas as telas
        document.querySelectorAll('.tela').forEach(tela => {
            tela.classList.remove('ativo');
        });
        
        // Adiciona a classe ativo na tela desejada
        const telaDesejada = document.getElementById(id);
        if (telaDesejada) {
            telaDesejada.classList.add('ativo');
            
            // Se for a tela de visualização da conta, atualiza os itens
            if (id === 'visualizar-conta') {
                console.log('Mostrando tela de visualização da conta');
                console.log('Itens no pedido:', this.pedidoEmElaboracao);
                this.atualizarVisualizacaoConta();
            }
        }
    }

    confirmarCelular() {
        const inputNome = document.querySelector('#nome-cadastro');
        const inputCelular = document.querySelector('#celular-cadastro');
        const nome = inputNome.value.trim();
        const celular = inputCelular.value;
        
        if (!celular || celular.match(/^[0-9]{2}[0-9]{5}[0-9]{4}$/)) {
            this.contaAtual = {
                nome: nome || null,
                celular: celular || null
            };
            this.mostrarTela('leitor-tag');
            this.lerTagNFC();
        } else {
            this.mostrarFeedback("Por favor, insira um número de celular válido ou clique em Pular");
        }
    }

    atualizarVisualizacaoConta() {
        const containerItens = document.getElementById('itens-conta-visualizacao');
        const totalElement = document.getElementById('valor-total-visualizacao');
        
        if (!containerItens || !totalElement) {
            console.error('Elementos da visualização da conta não encontrados');
            return;
        }

        let html = '';
        let total = 0;

        // Verifica se há itens no pedido em elaboração
        if (this.pedidoEmElaboracao.length === 0) {
            html = '<p class="mensagem-sem-itens">Nenhum item na conta</p>';
        } else {
            // Itera sobre todos os pedidos em elaboração
            this.pedidoEmElaboracao.forEach((item) => {
                // Calcula o valor total do item (preço * quantidade)
                const valorItem = item.preco * item.quantidade;
                total += valorItem;

                html += `
                    <div class="item-pedido">
                        <div class="info-item">
                            <h3>${item.nome}</h3>
                            <div class="detalhes">
                                <p>Quantidade: ${item.quantidade}</p>
                                <p>Valor unitário: R$ ${item.preco.toFixed(2)}</p>
                                <p>Valor total: R$ ${valorItem.toFixed(2)}</p>
                            </div>
                            ${item.opcoes && item.opcoes.length > 0 ? `
                                <div class="opcoes">
                                    <p>Opções selecionadas:</p>
                                    <ul>
                                        ${item.opcoes.map(opcao => `<li>${opcao}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
        }

        containerItens.innerHTML = html;
        totalElement.textContent = total.toFixed(2);
        console.log('Total da conta:', total);
        console.log('Itens na conta:', this.pedidoEmElaboracao);
    }

    atualizarPedidoEmElaboracao() {
        const containerItens = document.querySelector('.itens-pedido');
        const containerTotal = document.querySelector('.total-pedido');
        const mensagemInicial = document.querySelector('.mensagem-inicial');
        
        if (this.pedidoEmElaboracao.length > 0) {
            mensagemInicial.style.display = 'none';
            containerItens.style.display = 'block';
            containerTotal.style.display = 'block';

            let html = '';
            let total = 0;

            this.pedidoEmElaboracao.forEach((item, index) => {
                total += item.valorTotal;
                html += `
                    <div class="item-pedido">
                        ${item.numeroPedido ? `<div class="numero-pedido-item">Pedido #${item.numeroPedido}</div>` : ''}
                        <h3>${item.nome}</h3>
                        <div class="detalhes">
                            <p>Quantidade: ${item.quantidade}</p>
                            <p>Valor: R$ ${item.valorTotal.toFixed(2)}</p>
                        </div>
                        ${item.opcoes.length > 0 ? `
                            <div class="opcoes">
                                <p>Opções selecionadas:</p>
                                <ul>
                                    ${item.opcoes.map(opcao => `<li>${opcao}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        <button class="btn-remover-item" data-index="${index}">Remover</button>
                    </div>
                `;
            });

            containerItens.innerHTML = html;
            document.getElementById('valor-total-pedido').textContent = total.toFixed(2);

            // Adicionar eventos para os botões de remover
            containerItens.querySelectorAll('.btn-remover-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    this.pedidoEmElaboracao.splice(index, 1);
                    this.atualizarPedidoEmElaboracao();
                });
            });
        } else {
            mensagemInicial.style.display = 'flex';
            containerItens.style.display = 'none';
            containerTotal.style.display = 'none';
            containerItens.innerHTML = ''; // Limpa o conteúdo HTML
        }
    }

    atualizarDetalhesProduto(produto) {
        // Atualiza os detalhes do produto na tela de confirmação
        const detalhesProduto = document.querySelector('.detalhes-produto');
        if (!detalhesProduto) return;

        // Atualiza a descrição
        const descricao = detalhesProduto.querySelector('.descricao-quantidade p');
        if (descricao) {
            descricao.textContent = produto.descricao;
        }

        // Atualiza o valor total
        const valorTotal = document.getElementById('valor-total-produto');
        if (valorTotal) {
            valorTotal.textContent = produto.preco.toFixed(2);
        }

        // Atualiza as opções
        const opcoesContainer = document.querySelector('.opcoes-produto');
        if (opcoesContainer) {
            const listaOpcoes = opcoesContainer.querySelector('.lista-opcoes');
            if (listaOpcoes) {
                // Limpa as opções anteriores
                listaOpcoes.innerHTML = '';

                // Adiciona as novas opções
                const opcoes = [
                    { id: 'queijo-extra', label: 'Queijo Extra' },
                    { id: 'bacon-extra', label: 'Bacon Extra' },
                    { id: 'ovo', label: 'Ovo' },
                    { id: 'sem-cebola', label: 'Sem Cebola' }
                ];

                opcoes.forEach(opcao => {
                    const opcaoElement = document.createElement('div');
                    opcaoElement.className = 'opcao';
                    opcaoElement.innerHTML = `
                        <input type="checkbox" id="${opcao.id}" class="opcao-checkbox">
                        <span>${opcao.label}</span>
                    `;
                    listaOpcoes.appendChild(opcaoElement);
                });
            }
        }

        // Atualiza a quantidade
        const quantidadeInput = document.querySelector('.input-quantidade');
        if (quantidadeInput) {
            quantidadeInput.value = this.pedidoAtual.quantidade;
        }
    }

    atualizarStatusPedido(numeroPedido) {
        const statusPedido = document.querySelector('.status-pedido');
        const horaAtual = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Cria o HTML do novo pedido
        const novoPedidoHTML = `
            <div class="info-pedido">
                <span class="numero-pedido">#${numeroPedido}</span>
                <span class="status">Em Elaboração</span>
                <span class="hora">${horaAtual}</span>
            </div>
        `;
        
        // Se já existem pedidos, adiciona o novo abaixo
        if (statusPedido.innerHTML) {
            statusPedido.innerHTML += novoPedidoHTML;
        } else {
            // Se não existem pedidos, cria o cabeçalho e adiciona o primeiro pedido
            statusPedido.innerHTML = `
                <h3>Status do Pedido</h3>
                ${novoPedidoHTML}
            `;
        }
        
        statusPedido.style.display = 'block';
        document.querySelector('.mensagem-inicial').style.display = 'none';
        
        // Não limpa os itens do pedido em elaboração
        // this.pedidoEmElaboracao = [];
        // this.atualizarPedidoEmElaboracao();
    }

    atualizarValorTotalDetalhes() {
        if (this.pedidoAtual) {
            const valorTotal = this.pedidoAtual.preco * this.pedidoAtual.quantidade;
            document.getElementById('valor-total-produto').textContent = valorTotal.toFixed(2);
        }
    }
}

// Inicializa o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.sistema = new SistemaPedidos();
}); 
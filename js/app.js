class SistemaPedidos {
    constructor() {
        this.gateway = new GatewayPagamento();
        this.pedidoAtual = [];
        this.contaAtual = {
            itens: []
        };
        this.inicializar();
    }

    inicializar() {
        this.carregarProdutos();
        this.configurarEventos();
        
        // Garante que todas as telas estejam ocultas inicialmente
        document.querySelectorAll('.tela').forEach(tela => {
            tela.classList.remove('ativo');
            tela.style.display = 'none';
        });
        
        // Mostra a tela de boas-vindas
        this.mostrarTela('boas-vindas');
        
        // Armazena a referência do this
        const self = this;
        
        // Aguarda 4 segundos e então mostra o cardápio
        setTimeout(function() {
            console.log('Temporizador executado, mudando para cardápio');
            self.mostrarTela('cardapio');
        }, 3000);
    }

    carregarProdutos() {
        const container = document.getElementById('lista-produtos');
        
        // Agrupa produtos por categoria
        const produtosPorCategoria = produtos.reduce((acc, produto) => {
            if (!acc[produto.categoria]) {
                acc[produto.categoria] = [];
            }
            acc[produto.categoria].push(produto);
            return acc;
        }, {});

        // Cria o HTML para cada categoria
        const html = Object.entries(produtosPorCategoria).map(([categoria, produtos]) => `
            <div class="categoria-produtos">
                <h2 class="titulo-categoria">${categoria}</h2>
                <div class="grid-produtos">
                    ${produtos.map(produto => `
                        <div class="produto" data-id="${produto.id}">
                            <div class="produto-imagem">${produto.imagem}</div>
                            <div class="info">
                                <h3>${produto.nome}</h3>
                                <p>${produto.descricao}</p>
                                <div class="preco">R$ ${produto.preco.toFixed(2)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    configurarEventos() {
        // Eventos do cardápio
        const listaProdutos = document.getElementById('lista-produtos');
        if (listaProdutos) {
            listaProdutos.addEventListener('click', (e) => {
                const produto = e.target.closest('.produto');
                if (produto) {
                    const id = parseInt(produto.dataset.id);
                    this.adicionarItem(id);
                }
            });
        }

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
        const confirmacaoPedido = document.getElementById('confirmacao-pedido');
        if (confirmacaoPedido) {
            confirmacaoPedido.addEventListener('click', (e) => {
                if (e.target.matches('button')) {
                    this.confirmarPedido();
                }
            });
        }

        // Evento do botão de avançar na tela de celular
        const btnAvancarCelular = document.getElementById('btn-avancar-celular');
        if (btnAvancarCelular) {
            btnAvancarCelular.addEventListener('click', () => {
                this.confirmarCelular();
            });
        }

        // Evento do botão pular celular
        const btnPularCelular = document.getElementById('btn-pular-celular');
        if (btnPularCelular) {
            btnPularCelular.addEventListener('click', () => {
                this.mostrarTela('leitor-tag');
                this.lerTagNFC();
            });
        }

        // Evento do botão ver conta
        const btnVerConta = document.getElementById('btn-ver-conta');
        if (btnVerConta) {
            btnVerConta.addEventListener('click', () => {
                this.mostrarTela('visualizar-conta');
                this.atualizarVisualizacaoConta();
            });
        }

        // Evento do botão pagar conta
        const btnPagarConta = document.getElementById('btn-pagar-conta');
        if (btnPagarConta) {
            btnPagarConta.addEventListener('click', () => {
                this.mostrarTela('pagamento');
            });
        }

        // Evento do botão continuar pedindo
        const btnContinuarPedindo = document.getElementById('btn-continuar-pedindo');
        if (btnContinuarPedindo) {
            btnContinuarPedindo.addEventListener('click', () => {
                this.mostrarTela('cardapio');
            });
        }

        // Evento do botão pagar pedido
        const btnPagarPedido = document.getElementById('btn-pagar-pedido');
        if (btnPagarPedido) {
            btnPagarPedido.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.mostrarTela('pagamento');
            });
        }

        // Evento do botão voltar ao cardápio
        const btnVoltarCardapio = document.getElementById('btn-voltar-cardapio');
        if (btnVoltarCardapio) {
            btnVoltarCardapio.addEventListener('click', () => {
                this.mostrarTela('cardapio');
            });
        }

        // Botão voltar na tela de pagamento
        const btnVoltarPagamento = document.getElementById('btn-voltar-pagamento');
        if (btnVoltarPagamento) {
            btnVoltarPagamento.addEventListener('click', () => {
                this.mostrarTela('cardapio');
            });
        }

        // Evento do botão fazer pedido
        const btnFazerPedido = document.getElementById('btn-fazer-pedido');
        if (btnFazerPedido) {
            btnFazerPedido.addEventListener('click', () => {
                if (this.contaAtual.itens && this.contaAtual.itens.length > 0) {
                    // Gera um número aleatório para o pedido (entre 1000 e 9999)
                    const numeroPedido = Math.floor(Math.random() * 9000) + 1000;
                    
                    // Mostra a tela de aviso do pedido em elaboração
                    document.getElementById('numero-pedido').textContent = numeroPedido;
                    this.mostrarTela('pedido-elaboracao');
                    
                    // Configura o evento do botão voltar ao cardápio
                    const btnVoltarCardapioElaboracao = document.getElementById('btn-voltar-cardapio-elaboracao');
                    if (btnVoltarCardapioElaboracao) {
                        btnVoltarCardapioElaboracao.onclick = () => {
                            this.limparPedido();
                            this.mostrarTela('cardapio');
                        };
                    }
                } else {
                    this.mostrarFeedback("Adicione itens à sua conta antes de fazer o pedido");
                }
            });
        }

        // Evento do botão acrescentar item ao pedido
        const btnAcrescentarItem = document.getElementById('btn-acrescentar-item');
        if (btnAcrescentarItem) {
            btnAcrescentarItem.addEventListener('click', () => {
                if (this.pedidoAtual.length > 0) {
                    // Adiciona os itens do pedido atual à conta
                    this.contaAtual.itens = [...this.contaAtual.itens, ...this.pedidoAtual];
                    
                    // Mostra o feedback de item acrescentado
                    this.mostrarFeedback("Item acrescentado");
                    
                    // Limpa o pedido atual e volta ao cardápio
                    this.limparPedido();
                    this.mostrarTela('cardapio');
                }
            });
        }

        // Evento do botão confirmar pagamento
        const btnConfirmarPagamento = document.getElementById('btn-confirmar-pagamento');
        if (btnConfirmarPagamento) {
            btnConfirmarPagamento.addEventListener('click', async () => {
                const receberContaCelular = document.getElementById('receber-conta-celular')?.checked;
                const celular = document.getElementById('celular-cartao')?.value;
                
                // Calcula o total da conta atual
                const totalConta = this.contaAtual.itens.reduce((total, item) => {
                    let itemTotal = item.preco * item.quantidade;
                    
                    // Adiciona acréscimos
                    if (item.acrescimos.embalagem) itemTotal += 2.00 * item.quantidade;
                    if (item.acrescimos.catchup) itemTotal += 1.00 * item.quantidade;
                    if (item.acrescimos.maionese) itemTotal += 1.00 * item.quantidade;
                    if (item.acrescimos.molhoEspecial) itemTotal += 2.00 * item.quantidade;
                    if (item.acrescimos.batataFrita) itemTotal += 15.90 * item.quantidade;
                    
                    return total + itemTotal;
                }, 0);

                const pagamento = await this.gateway.processarCartao(totalConta);
                
                if (receberContaCelular && celular) {
                    await this.gateway.enviarContaCelular(celular, this.contaAtual.itens);
                }
                
                // Limpa a conta atual
                this.contaAtual = {
                    itens: []
                };
                
                // Volta para a tela de boas-vindas
                this.mostrarTela('boas-vindas');
            });
        }

        // Evento do botão cancelar pagamento
        const btnCancelarPagamento = document.getElementById('btn-cancelar-pagamento');
        if (btnCancelarPagamento) {
            btnCancelarPagamento.addEventListener('click', () => {
                this.mostrarTela('pagamento');
            });
        }
    }

    adicionarItem(id) {
        const produto = produtos.find(p => p.id === id);
        if (produto) {
            // Preenche as informações do produto na tela
            document.getElementById('imagem-produto-selecionado').innerHTML = produto.imagem;
            document.getElementById('nome-produto-selecionado').textContent = produto.nome;
            document.getElementById('descricao-produto-selecionado').textContent = produto.descricao;
            document.getElementById('preco-produto-selecionado').textContent = produto.preco.toFixed(2);

            // Adiciona o produto ao pedido
            this.pedidoAtual.push({
                ...produto,
                quantidade: 1,
                opcoes: [],
                acrescimos: {
                    embalagem: false,
                    catchup: false,
                    maionese: false,
                    molhoEspecial: false,
                    batataFrita: false
                }
            });

            this.mostrarTela('confirmacao-pedido');
            this.atualizarListaPedido();
        }
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
        // Calcula o total da conta atual
        const totalConta = this.contaAtual.itens.reduce((total, item) => {
            let itemTotal = item.preco * item.quantidade;
            
            // Adiciona acréscimos
            if (item.acrescimos.embalagem) itemTotal += 2.00 * item.quantidade;
            if (item.acrescimos.catchup) itemTotal += 1.00 * item.quantidade;
            if (item.acrescimos.maionese) itemTotal += 1.00 * item.quantidade;
            if (item.acrescimos.molhoEspecial) itemTotal += 2.00 * item.quantidade;
            if (item.acrescimos.batataFrita) itemTotal += 15.90 * item.quantidade;
            
            return total + itemTotal;
        }, 0);

        if (metodo === 'cartao') {
            // Mostra a tela de confirmação
            this.mostrarTela('confirmacao-cartao');

            // Preenche os dados do cartão na tela de confirmação
            const bandeiraCartao = document.getElementById('bandeira-cartao');
            const numeroCartao = document.getElementById('numero-cartao');
            const titularCartao = document.getElementById('titular-cartao');
            const valorTotalCartao = document.getElementById('valor-total-cartao');

            if (bandeiraCartao) bandeiraCartao.src = 'img/bandeiras/bandeira.png';
            if (numeroCartao) numeroCartao.textContent = '**** **** **** 1234';
            if (titularCartao) titularCartao.textContent = 'TITULAR DO CARTÃO';
            if (valorTotalCartao) valorTotalCartao.textContent = totalConta.toFixed(2);

            // Configura o evento do checkbox de receber conta no celular
            const checkboxReceberConta = document.getElementById('receber-conta-celular');
            const campoCelular = document.getElementById('campo-celular-cartao');
            
            if (checkboxReceberConta && campoCelular) {
                checkboxReceberConta.addEventListener('change', () => {
                    campoCelular.style.display = checkboxReceberConta.checked ? 'block' : 'none';
                });
            }
        } else if (metodo === 'pix') {
            this.mostrarTela('pix');
            const qrcode = this.gateway.gerarQRCode(totalConta);
            document.getElementById('qrcode').innerHTML = `<img src="${qrcode}" alt="QR Code PIX">`;
            document.getElementById('valor-total-pix').textContent = totalConta.toFixed(2);
            
            // Configura o evento do checkbox de receber conta no celular
            const checkboxReceberConta = document.getElementById('receber-conta-celular-pix');
            const campoCelular = document.getElementById('campo-celular-pix');
            
            if (checkboxReceberConta && campoCelular) {
                checkboxReceberConta.addEventListener('change', () => {
                    campoCelular.style.display = checkboxReceberConta.checked ? 'block' : 'none';
                });
            }
            
            // Inicia a verificação do pagamento
            this.verificarPagamentoPIX();
        }
    }

    async verificarPagamentoPIX() {
        // Calcula o total da conta atual
        const totalConta = this.contaAtual.itens.reduce((total, item) => {
            let itemTotal = item.preco * item.quantidade;
            
            // Adiciona acréscimos
            if (item.acrescimos.embalagem) itemTotal += 2.00 * item.quantidade;
            if (item.acrescimos.catchup) itemTotal += 1.00 * item.quantidade;
            if (item.acrescimos.maionese) itemTotal += 1.00 * item.quantidade;
            if (item.acrescimos.molhoEspecial) itemTotal += 2.00 * item.quantidade;
            if (item.acrescimos.batataFrita) itemTotal += 15.90 * item.quantidade;
            
            return total + itemTotal;
        }, 0);

        // Simula um delay de 3 segundos antes de confirmar o pagamento
        setTimeout(() => {
            // Simula um pagamento bem-sucedido
            const resultado = {
                sucesso: true,
                dados: {
                    titular: 'Cliente PIX',
                    valor: totalConta
                }
            };

            // Preenche os dados do pagamento na tela de confirmação
            document.getElementById('titular-pix').textContent = resultado.dados.titular;
            document.getElementById('valor-total-pix').textContent = resultado.dados.valor.toFixed(2);
            
            // Mostra a tela de confirmação
            this.mostrarTela('confirmacao-pix');

            // Configura o evento do checkbox de receber conta no celular
            const checkboxReceberConta = document.getElementById('receber-conta-celular-pix');
            const campoCelular = document.getElementById('campo-celular-pix');
            
            if (checkboxReceberConta && campoCelular) {
                checkboxReceberConta.addEventListener('change', () => {
                    campoCelular.style.display = checkboxReceberConta.checked ? 'block' : 'none';
                });
            }
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
            const descricaoItens = this.pedidoAtual.map(item => {
                let descricao = `${item.quantidade}x ${item.nome}`;
                const acrescimos = [];
                
                if (item.acrescimos.embalagem) acrescimos.push('Embalagem para levar');
                if (item.acrescimos.catchup) acrescimos.push('Catchup');
                if (item.acrescimos.maionese) acrescimos.push('Maionese');
                if (item.acrescimos.molhoEspecial) acrescimos.push('Molho Especial');
                if (item.acrescimos.batataFrita) acrescimos.push('Batata Frita');
                
                if (acrescimos.length > 0) {
                    descricao += ` (${acrescimos.join(', ')})`;
                }
                
                return descricao;
            }).join('; ');

            this.mostrarFeedback(`Acrescentado na conta os itens: ${descricaoItens}`);
            this.limparPedido();
            this.mostrarTela('cardapio');
        }
    }

    atualizarListaPedido() {
        // Atualiza o total
        document.getElementById('valor-total-pedido').textContent = this.calcularTotal().toFixed(2);

        // Configura os eventos dos botões de quantidade
        const btnDiminuir = document.querySelector('.controles-quantidade .btn-quantidade[data-acao="diminuir"]');
        const btnAumentar = document.querySelector('.controles-quantidade .btn-quantidade[data-acao="aumentar"]');
        const inputQuantidade = document.querySelector('.controles-quantidade .input-quantidade');

        if (this.pedidoAtual.length > 0) {
            const item = this.pedidoAtual[this.pedidoAtual.length - 1];
            inputQuantidade.value = item.quantidade;

            if (btnDiminuir) {
                btnDiminuir.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (item.quantidade > 1) {
                        item.quantidade--;
                        inputQuantidade.value = item.quantidade;
                        this.atualizarListaPedido();
                    }
                };
            }

            if (btnAumentar) {
                btnAumentar.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    item.quantidade++;
                    inputQuantidade.value = item.quantidade;
                    this.atualizarListaPedido();
                };
            }

            if (inputQuantidade) {
                inputQuantidade.onchange = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const quantidade = parseInt(inputQuantidade.value);
                    if (quantidade > 0) {
                        item.quantidade = quantidade;
                        this.atualizarListaPedido();
                    }
                };
            }
        }

        // Configura os eventos das opções
        document.querySelectorAll('.opcao input[type="checkbox"]').forEach(checkbox => {
            checkbox.onchange = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const item = this.pedidoAtual[this.pedidoAtual.length - 1];
                switch(checkbox.value) {
                    case 'embalagem':
                        item.acrescimos.embalagem = checkbox.checked;
                        break;
                    case 'catchup':
                        item.acrescimos.catchup = checkbox.checked;
                        break;
                    case 'maionese':
                        item.acrescimos.maionese = checkbox.checked;
                        break;
                    case 'molho-especial':
                        item.acrescimos.molhoEspecial = checkbox.checked;
                        break;
                    case 'batata-frita':
                        item.acrescimos.batataFrita = checkbox.checked;
                        break;
                }
                this.atualizarListaPedido();
            };
        });

        // Configura o evento do botão de pagar
        const btnPagarPedido = document.getElementById('btn-pagar-pedido');
        if (btnPagarPedido) {
            btnPagarPedido.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.mostrarTela('pagamento');
            };
        }
    }

    calcularTotal() {
        return this.pedidoAtual.reduce((total, item) => {
            let itemTotal = item.preco * item.quantidade;
            
            // Adiciona acréscimos
            if (item.acrescimos.embalagem) itemTotal += 2.00 * item.quantidade;
            if (item.acrescimos.catchup) itemTotal += 1.00 * item.quantidade;
            if (item.acrescimos.maionese) itemTotal += 1.00 * item.quantidade;
            if (item.acrescimos.molhoEspecial) itemTotal += 2.00 * item.quantidade;
            if (item.acrescimos.batataFrita) itemTotal += 15.90 * item.quantidade;
            
            return total + itemTotal;
        }, 0);
    }

    limparPedido() {
        this.pedidoAtual = [];
    }

    mostrarFeedback(mensagem) {
        const feedback = document.createElement('div');
        feedback.className = 'feedback sucesso';
        feedback.textContent = mensagem;
        document.querySelector('.container').appendChild(feedback);
        setTimeout(() => feedback.remove(), 3000);
    }

    mostrarTela(id) {
        console.log('Mudando para tela:', id);
        
        // Remove a classe ativo de todas as telas
        document.querySelectorAll('.tela').forEach(tela => {
            tela.classList.remove('ativo');
            tela.style.display = 'none';
        });
        
        // Adiciona a classe ativo na tela desejada
        const telaAlvo = document.getElementById(id);
        if (telaAlvo) {
            telaAlvo.style.display = 'block';
            telaAlvo.classList.add('ativo');
            console.log('Tela ativada:', id);
        } else {
            console.error('Tela não encontrada:', id);
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
        const container = document.getElementById('itens-conta-visualizacao');
        
        if (!this.contaAtual.itens || this.contaAtual.itens.length === 0) {
            container.innerHTML = '<p class="mensagem-vazia">Nenhum item na conta</p>';
            document.getElementById('valor-total-visualizacao').textContent = '0,00';
            return;
        }

        container.innerHTML = this.contaAtual.itens.map(item => {
            // Formata a descrição dos acréscimos
            const acrescimos = [];
            if (item.acrescimos.embalagem) acrescimos.push('Embalagem para levar');
            if (item.acrescimos.catchup) acrescimos.push('Catchup');
            if (item.acrescimos.maionese) acrescimos.push('Maionese');
            if (item.acrescimos.molhoEspecial) acrescimos.push('Molho Especial');
            if (item.acrescimos.batataFrita) acrescimos.push('Batata Frita');

            // Calcula o preço total do item com acréscimos
            let precoTotal = item.preco;
            if (item.acrescimos.embalagem) precoTotal += 2.00;
            if (item.acrescimos.catchup) precoTotal += 1.00;
            if (item.acrescimos.maionese) precoTotal += 1.00;
            if (item.acrescimos.molhoEspecial) precoTotal += 2.00;
            if (item.acrescimos.batataFrita) precoTotal += 15.90;

            return `
                <div class="item-pedido">
                    <div class="info-item">
                        <span>${item.nome}</span>
                        ${acrescimos.length > 0 ? `<small>(${acrescimos.join(', ')})</small>` : ''}
                        <span>R$ ${precoTotal.toFixed(2)}</span>
                    </div>
                    <div class="quantidade">
                        <span>x${item.quantidade}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Atualiza o total
        const total = this.contaAtual.itens.reduce((total, item) => {
            let itemTotal = item.preco * item.quantidade;
            
            // Adiciona acréscimos
            if (item.acrescimos.embalagem) itemTotal += 2.00 * item.quantidade;
            if (item.acrescimos.catchup) itemTotal += 1.00 * item.quantidade;
            if (item.acrescimos.maionese) itemTotal += 1.00 * item.quantidade;
            if (item.acrescimos.molhoEspecial) itemTotal += 2.00 * item.quantidade;
            if (item.acrescimos.batataFrita) itemTotal += 15.90 * item.quantidade;
            
            return total + itemTotal;
        }, 0);
        
        document.getElementById('valor-total-visualizacao').textContent = total.toFixed(2);
    }
}

// Inicializa o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.sistema = new SistemaPedidos();
}); 
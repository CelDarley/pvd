class SistemaPedidos {
    constructor() {
        this.gateway = new GatewayPagamento();
        this.pedidoAtual = [];
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
                const forma = e.currentTarget.dataset.pagamento;
                this.processarPagamento(forma);
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
    }

    adicionarItem(id) {
        const produto = produtos.find(p => p.id === id);
        if (!produto) return;

        // Preenche as informações do produto na tela
        document.getElementById('imagem-produto').innerHTML = produto.imagem;
        document.getElementById('nome-produto').textContent = produto.nome;
        document.getElementById('descricao-produto').textContent = produto.descricao;
        document.getElementById('preco-produto').textContent = produto.preco.toFixed(2);

        // Adiciona o produto ao pedido com as opções padrão
        this.pedidoAtual.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
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

        // Mostra a tela de confirmação do produto
        this.mostrarTela('confirmacao-produto');
        this.atualizarListaPedido();
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
            this.mostrarTela('leitor-cartao');
            const resultado = await this.gateway.lerCartao();
            if (resultado.sucesso) {
                // Preenche os dados do cartão na tela de confirmação
                document.getElementById('bandeira-cartao').src = resultado.dados.bandeira;
                document.getElementById('numero-cartao').textContent = resultado.dados.numero;
                document.getElementById('titular-cartao').textContent = resultado.dados.titular;
                document.getElementById('valor-total-cartao').textContent = this.calcularTotal().toFixed(2);
                
                // Mostra a tela de confirmação
                this.mostrarTela('confirmacao-cartao');
            }
        } else if (metodo === 'pix') {
            this.mostrarTela('pix');
            const valor = this.calcularTotal();
            const qrcode = this.gateway.gerarQRCode(valor);
            document.getElementById('qrcode').innerHTML = `<img src="${qrcode}" alt="QR Code PIX">`;
            
            // Inicia a verificação do pagamento
            this.verificarPagamentoPIX();
        }
    }

    async verificarPagamentoPIX() {
        // Simula um delay de 3 segundos antes de confirmar o pagamento
        setTimeout(() => {
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

        // Configura os eventos dos botões de quantidade
        const btnDiminuir = document.getElementById('btn-diminuir');
        const btnAumentar = document.getElementById('btn-aumentar');
        const inputQuantidade = document.getElementById('quantidade');

        if (this.pedidoAtual.length > 0) {
            const item = this.pedidoAtual[this.pedidoAtual.length - 1];
            inputQuantidade.value = item.quantidade;

            btnDiminuir.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (item.quantidade > 1) {
                    item.quantidade--;
                    inputQuantidade.value = item.quantidade;
                    this.atualizarListaPedido();
                }
            };

            btnAumentar.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                item.quantidade++;
                inputQuantidade.value = item.quantidade;
                this.atualizarListaPedido();
            };

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

        // Configura os eventos das opções
        document.querySelectorAll('.opcao input[type="checkbox"]').forEach(checkbox => {
            checkbox.onchange = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const item = this.pedidoAtual[this.pedidoAtual.length - 1];
                switch(checkbox.id) {
                    case 'queijo-extra':
                        item.opcoes.push('Queijo Extra');
                        break;
                    case 'bacon-extra':
                        item.opcoes.push('Bacon Extra');
                        break;
                    case 'ovo':
                        item.opcoes.push('Ovo');
                        break;
                    case 'sem-cebola':
                        item.opcoes.push('Sem Cebola');
                        break;
                }
                this.atualizarListaPedido();
            };
        });
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

    confirmarPedido() {
        // Gera um número aleatório para o pedido (entre 100 e 999)
        const numeroPedido = Math.floor(Math.random() * 900) + 100;
        
        // Atualiza o número do pedido na tela
        document.getElementById('numero-pedido').textContent = numeroPedido;
        
        // Adiciona os itens do pedido atual aos pedidos feitos
        this.pedidosFeitos = [...this.pedidosFeitos, ...this.pedidoAtual];
        
        // Mostra a tela de confirmação
        this.mostrarTela('pedido-confirmado');
        
        // Limpa apenas o pedido atual para permitir novos pedidos
        this.pedidoAtual = [];
    }

    limparPedido() {
        this.pedidoAtual = [];
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
        if (!container) return;

        // Usa os pedidos feitos ao invés do pedido atual
        container.innerHTML = this.pedidosFeitos.map(item => {
            // Formata as opções e acréscimos
            const opcoes = item.opcoes.length > 0 ? 
                `<div class="opcoes-item">${item.opcoes.join(', ')}</div>` : '';
            
            const acrescimos = [];
            if (item.acrescimos.embalagem) acrescimos.push('Embalagem para levar');
            if (item.acrescimos.catchup) acrescimos.push('Catchup');
            if (item.acrescimos.maionese) acrescimos.push('Maionese');
            if (item.acrescimos.molhoEspecial) acrescimos.push('Molho Especial');
            if (item.acrescimos.batataFrita) acrescimos.push('Batata Frita');
            
            const acrescimosHtml = acrescimos.length > 0 ? 
                `<div class="acrescimos-item">${acrescimos.join(', ')}</div>` : '';

            // Calcula o preço total do item incluindo acréscimos
            let precoTotal = item.preco;
            if (item.acrescimos.embalagem) precoTotal += 2.00;
            if (item.acrescimos.catchup) precoTotal += 1.00;
            if (item.acrescimos.maionese) precoTotal += 1.00;
            if (item.acrescimos.molhoEspecial) precoTotal += 2.00;
            if (item.acrescimos.batataFrita) precoTotal += 15.90;

            return `
                <div class="item-pedido">
                    <div class="info-item">
                        <h3>${item.nome}</h3>
                        ${opcoes}
                        ${acrescimosHtml}
                        <div class="quantidade">
                            <button onclick="sistema.ajustarQuantidade(${item.id}, -1)">-</button>
                            <input type="number" value="${item.quantidade}" min="1" 
                                onchange="sistema.atualizarQuantidade(${item.id}, this.value)">
                            <button onclick="sistema.ajustarQuantidade(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <div class="preco">R$ ${(precoTotal * item.quantidade).toFixed(2)}</div>
                </div>
            `;
        }).join('');

        // Atualiza o total usando os pedidos feitos
        const total = this.pedidosFeitos.reduce((acc, item) => {
            let precoItem = item.preco;
            if (item.acrescimos.embalagem) precoItem += 2.00;
            if (item.acrescimos.catchup) precoItem += 1.00;
            if (item.acrescimos.maionese) precoItem += 1.00;
            if (item.acrescimos.molhoEspecial) precoItem += 2.00;
            if (item.acrescimos.batataFrita) precoItem += 15.90;
            return acc + (precoItem * item.quantidade);
        }, 0);
        
        document.getElementById('valor-total-visualizacao').textContent = total.toFixed(2);
    }

    ajustarQuantidade(id, delta) {
        const item = this.pedidosFeitos.find(item => item.id === id);
        if (item) {
            item.quantidade = Math.max(1, item.quantidade + delta);
            this.atualizarVisualizacaoConta();
        }
    }

    atualizarQuantidade(id, novaQuantidade) {
        const item = this.pedidosFeitos.find(item => item.id === id);
        if (item) {
            item.quantidade = Math.max(1, parseInt(novaQuantidade) || 1);
            this.atualizarVisualizacaoConta();
        }
    }
}

// Inicializa o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.sistema = new SistemaPedidos();
}); 
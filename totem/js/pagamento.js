class GatewayPagamento {
    constructor() {
        this.pagamentos = new Map();
    }

    // Simula leitura de cartão
    async lerCartao() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    sucesso: true,
                    mensagem: "Cartão lido com sucesso",
                    dados: {
                        numero: "**** **** **** 1234",
                        bandeira: "VISA"
                    }
                });
            }, 2000);
        });
    }

    // Simula processamento de pagamento com cartão
    async processarCartao(valor) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const sucesso = Math.random() > 0.1; // 90% de chance de sucesso
                resolve({
                    sucesso,
                    mensagem: sucesso ? "Pagamento aprovado" : "Pagamento recusado",
                    transacao: sucesso ? Math.random().toString(36).substr(2, 9) : null
                });
            }, 1500);
        });
    }

    // Gera QR Code para pagamento PIX
    gerarQRCode(valor) {
        // Em um caso real, isso seria gerado pelo backend
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=pix://pagamento/${valor}`;
    }

    // Simula verificação de pagamento PIX
    async verificarPagamentoPIX() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const sucesso = Math.random() > 0.1; // 90% de chance de sucesso
                resolve({
                    sucesso,
                    mensagem: sucesso ? "Pagamento PIX confirmado" : "Pagamento PIX pendente",
                    transacao: sucesso ? Math.random().toString(36).substr(2, 9) : null
                });
            }, 2000);
        });
    }

    // Simula leitura de tag NFC
    async lerTagNFC() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    sucesso: true,
                    mensagem: "Tag lida com sucesso",
                    dados: {
                        id: Math.random().toString(36).substr(2, 9),
                        tipo: Math.random() > 0.5 ? "cartao" : "pulseira"
                    }
                });
            }, 1500);
        });
    }
} 
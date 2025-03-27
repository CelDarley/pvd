const produtos = [
    {
        id: 1,
        nome: "X-Burger",
        descricao: "Hambúrguer com queijo, alface, tomate e molho especial",
        preco: 25.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <circle cx="150" cy="80" r="40" fill="#8B4513"/>
            <circle cx="150" cy="80" r="35" fill="#DEB887"/>
            <circle cx="150" cy="80" r="30" fill="#FFA07A"/>
            <text x="150" y="160" text-anchor="middle" fill="#333" font-size="16">X-Burger</text>
        </svg>`,
        categoria: "Hambúrgueres"
    },
    {
        id: 2,
        nome: "X-Bacon",
        descricao: "Hambúrguer com queijo, bacon, alface, tomate e molho especial",
        preco: 29.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <circle cx="150" cy="80" r="40" fill="#8B4513"/>
            <circle cx="150" cy="80" r="35" fill="#DEB887"/>
            <circle cx="150" cy="80" r="30" fill="#FFA07A"/>
            <path d="M120,80 L180,80" stroke="#8B0000" stroke-width="8"/>
            <text x="150" y="160" text-anchor="middle" fill="#333" font-size="16">X-Bacon</text>
        </svg>`,
        categoria: "Hambúrgueres"
    },
    {
        id: 3,
        nome: "X-Tudo",
        descricao: "Hambúrguer com queijo, bacon, ovo, alface, tomate e molho especial",
        preco: 32.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <circle cx="150" cy="80" r="40" fill="#8B4513"/>
            <circle cx="150" cy="80" r="35" fill="#DEB887"/>
            <circle cx="150" cy="80" r="30" fill="#FFA07A"/>
            <path d="M120,80 L180,80" stroke="#8B0000" stroke-width="8"/>
            <circle cx="150" cy="80" r="15" fill="#FFD700"/>
            <text x="150" y="160" text-anchor="middle" fill="#333" font-size="16">X-Tudo</text>
        </svg>`,
        categoria: "Hambúrgueres"
    },
    {
        id: 4,
        nome: "Refrigerante",
        descricao: "Lata 350ml",
        preco: 6.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <rect x="120" y="40" width="60" height="120" fill="#FF0000"/>
            <text x="150" y="180" text-anchor="middle" fill="#333" font-size="16">Refrigerante</text>
        </svg>`,
        categoria: "Bebidas"
    },
    {
        id: 5,
        nome: "Água Mineral",
        descricao: "Garrafa 500ml",
        preco: 4.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <rect x="120" y="40" width="60" height="120" fill="#87CEEB"/>
            <text x="150" y="180" text-anchor="middle" fill="#333" font-size="16">Água Mineral</text>
        </svg>`,
        categoria: "Bebidas"
    },
    {
        id: 6,
        nome: "Suco Natural",
        descricao: "Copo 300ml",
        preco: 8.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <rect x="120" y="40" width="60" height="120" fill="#FFA500"/>
            <text x="150" y="180" text-anchor="middle" fill="#333" font-size="16">Suco Natural</text>
        </svg>`,
        categoria: "Bebidas"
    },
    {
        id: 7,
        nome: "Sorvete",
        descricao: "Copo com 2 bolas",
        preco: 12.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <circle cx="150" cy="100" r="30" fill="#FFB6C1"/>
            <circle cx="150" cy="70" r="25" fill="#87CEEB"/>
            <text x="150" y="180" text-anchor="middle" fill="#333" font-size="16">Sorvete</text>
        </svg>`,
        categoria: "Sobremesas"
    },
    {
        id: 8,
        nome: "Pudim",
        descricao: "Pudim de leite com calda",
        preco: 9.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <circle cx="150" cy="100" r="40" fill="#DEB887"/>
            <path d="M110,100 Q150,140 190,100" stroke="#8B4513" stroke-width="4" fill="none"/>
            <text x="150" y="180" text-anchor="middle" fill="#333" font-size="16">Pudim</text>
        </svg>`,
        categoria: "Sobremesas"
    },
    {
        id: 9,
        nome: "Milk Shake",
        descricao: "Milk shake de chocolate",
        preco: 15.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <rect x="120" y="40" width="60" height="120" fill="#8B4513"/>
            <circle cx="150" cy="40" r="30" fill="#8B4513"/>
            <text x="150" y="180" text-anchor="middle" fill="#333" font-size="16">Milk Shake</text>
        </svg>`,
        categoria: "Sobremesas"
    }
]; 
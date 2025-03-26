const produtos = [
    {
        id: 1,
        nome: "X-Burger",
        descricao: "Hambúrguer com queijo, alface, tomate e molho especial",
        preco: 25.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <circle cx="150" cy="100" r="40" fill="#8B4513"/>
            <circle cx="150" cy="100" r="35" fill="#DEB887"/>
            <circle cx="150" cy="100" r="30" fill="#FFA07A"/>
            <text x="150" y="180" text-anchor="middle" fill="#333" font-size="16">X-Burger</text>
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
            <circle cx="150" cy="100" r="40" fill="#8B4513"/>
            <circle cx="150" cy="100" r="35" fill="#DEB887"/>
            <circle cx="150" cy="100" r="30" fill="#FFA07A"/>
            <path d="M120,100 L180,100" stroke="#8B0000" stroke-width="8"/>
            <text x="150" y="180" text-anchor="middle" fill="#333" font-size="16">X-Bacon</text>
        </svg>`,
        categoria: "Hambúrgueres"
    },
    {
        id: 3,
        nome: "Batata Frita",
        descricao: "Porção de batatas fritas crocantes",
        preco: 15.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <rect x="100" y="80" width="20" height="60" fill="#FFD700"/>
            <rect x="130" y="60" width="20" height="80" fill="#FFD700"/>
            <rect x="160" y="70" width="20" height="70" fill="#FFD700"/>
            <text x="150" y="180" text-anchor="middle" fill="#333" font-size="16">Batata Frita</text>
        </svg>`,
        categoria: "Acompanhamentos"
    },
    {
        id: 4,
        nome: "Refrigerante",
        descricao: "Lata 350ml",
        preco: 6.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <rect x="130" y="40" width="40" height="120" fill="#C0C0C0"/>
            <circle cx="150" cy="100" r="15" fill="#FF0000"/>
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
            <path d="M140,40 L160,40 L150,160 Z" fill="#87CEEB"/>
            <path d="M145,50 L155,50 L150,150 Z" fill="#ADD8E6"/>
            <text x="150" y="180" text-anchor="middle" fill="#333" font-size="16">Água Mineral</text>
        </svg>`,
        categoria: "Bebidas"
    },
    {
        id: 6,
        nome: "Sorvete",
        descricao: "Copo com 2 bolas",
        preco: 12.90,
        imagem: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f5f5f5"/>
            <circle cx="150" cy="80" r="30" fill="#FFB6C1"/>
            <circle cx="150" cy="120" r="35" fill="#FFC0CB"/>
            <rect x="140" y="150" width="20" height="40" fill="#C0C0C0"/>
            <text x="150" y="180" text-anchor="middle" fill="#333" font-size="16">Sorvete</text>
        </svg>`,
        categoria: "Sobremesas"
    }
]; 
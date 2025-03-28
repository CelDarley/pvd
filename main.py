import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk
import os

class ChopApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Cardápio de Chops")
        self.root.geometry("800x600")
        
        # Configuração do estilo
        self.style = ttk.Style()
        self.style.configure("TButton", padding=10, font=('Helvetica', 12))
        self.style.configure("TLabel", font=('Helvetica', 14))
        
        # Frame principal
        self.main_frame = ttk.Frame(self.root, padding="20")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Título
        self.title_label = ttk.Label(
            self.main_frame, 
            text="Cardápio de Chops", 
            font=('Helvetica', 24, 'bold')
        )
        self.title_label.grid(row=0, column=0, columnspan=2, pady=20)
        
        # Lista de produtos
        self.produtos = [
            ("Pilsen 300ml", "R$ 15,00"),
            ("Pilsen 500ml", "R$ 25,00"),
            ("Session IPA 300ml", "R$ 18,00"),
            ("Session IPA 500ml", "R$ 30,00"),
            ("Larger 300ml", "R$ 16,00"),
            ("Larger 500ml", "R$ 28,00")
        ]
        
        # Criar botões para cada produto
        for i, (produto, preco) in enumerate(self.produtos):
            btn = ttk.Button(
                self.main_frame,
                text=f"{produto}\n{preco}",
                command=lambda p=produto: self.selecionar_produto(p)
            )
            btn.grid(row=i+1, column=0, pady=10, padx=10, sticky="ew")
            
        # Frame para o carrinho
        self.carrinho_frame = ttk.LabelFrame(self.main_frame, text="Carrinho", padding="10")
        self.carrinho_frame.grid(row=1, column=1, rowspan=6, padx=20, sticky="nsew")
        
        # Lista do carrinho
        self.carrinho_listbox = tk.Listbox(self.carrinho_frame, width=30, height=10)
        self.carrinho_listbox.pack(pady=10)
        
        # Total
        self.total_label = ttk.Label(self.carrinho_frame, text="Total: R$ 0,00")
        self.total_label.pack(pady=10)
        
        # Botão de finalizar
        self.finalizar_btn = ttk.Button(
            self.carrinho_frame,
            text="Finalizar Pedido",
            command=self.finalizar_pedido
        )
        self.finalizar_btn.pack(pady=10)
        
        self.carrinho = []
        
    def selecionar_produto(self, produto):
        self.carrinho.append(produto)
        self.atualizar_carrinho()
        
    def atualizar_carrinho(self):
        self.carrinho_listbox.delete(0, tk.END)
        for item in self.carrinho:
            self.carrinho_listbox.insert(tk.END, item)
        
        # Calcular total
        total = 0
        for item in self.carrinho:
            for produto, preco in self.produtos:
                if item == produto:
                    total += float(preco.replace("R$ ", "").replace(",", "."))
        
        self.total_label.config(text=f"Total: R$ {total:.2f}".replace(".", ","))
        
    def finalizar_pedido(self):
        if not self.carrinho:
            messagebox.showwarning("Aviso", "Carrinho vazio!")
            return
            
        mensagem = "Pedido finalizado!\n\n"
        for item in self.carrinho:
            mensagem += f"- {item}\n"
        mensagem += f"\nTotal: {self.total_label.cget('text')}"
        
        messagebox.showinfo("Sucesso", mensagem)
        self.carrinho = []
        self.atualizar_carrinho()

if __name__ == "__main__":
    root = tk.Tk()
    app = ChopApp(root)
    root.mainloop() 
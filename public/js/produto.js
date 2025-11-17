// Importar biblioteca de máscara (adicione no HTML antes de fechar </body>)
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js"></script>

////////////////////////////////////////////////////////////FUNÇÃO MENU///////////////////////////////////////////////////////////
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');

    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');

    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');                                                                                          

    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');

    document.body.style.overflow = 'auto';
}

// Função para aplicar máscaras nos inputs
function aplicarMascaras() {
    // Máscara para CPF: 000.000.000-00
    $('#produto-cpf').mask('000.000.000-00', {reverse: true});

    // Máscara para CNPJ: 00.000.000/0000-00
    $('#produto-cnpj').mask('00.000.000/0000-00', {reverse: true});

    // Máscara para Telefone: (00) 00000-0000 ou (00) 0000-0000
    $('#produto-telefone').mask('(00) 00000-0000');

    // Máscara para CEP: 00000-000
    $('#produto-cep').mask('00000-000', {reverse: true});

    // Máscara para Data: 00/00/0000
    $('#produto-data-cadastro').mask('00/00/0000', {reverse: true});

    // Máscara para Preço: 0.000,00 (formato brasileiro)
    $('#produto-preco-atual').mask('#.##0,00', {reverse: true});

    // Máscara para Código de Barras (13 dígitos): 0000000000000
    $('#produto-codigo').mask('0000000000000');

    // Máscara para Estoque (apenas números)
    $('#produto-estoque').mask('0000000');

    // Máscara para Quantidade Mínima (apenas números)
    $('#produto-quantidade-minima').mask('0000000');

    // Máscara para Lote (alfanumérico com padrão customizado)
    $('#produto-lote').mask('AAAA0000', {translation: {'A': {pattern: /[a-zA-Z]/}}});
}

// Função para buscar CEP e preencher endereço (via ViaCEP)
async function buscarCEP(cep) {
    // Remove caracteres especiais para buscar
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        alert('CEP inválido! Digite um CEP com 8 dígitos.');
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const endereco = await response.json();

        if (endereco.erro) {
            alert('CEP não encontrado!');
            return;
        }

        // Preenche os campos de endereço
        document.getElementById('produto-rua').value = endereco.logradouro || '';
        document.getElementById('produto-bairro').value = endereco.bairro || '';
        document.getElementById('produto-cidade').value = endereco.localidade || '';
        document.getElementById('produto-estado').value = endereco.uf || '';

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Verifique sua conexão.');
    }
}

// função cadastrarProduto original (atualizada)
async function cadastrarProduto(event) {
    event.preventDefault();

    const produto = {
        nome: document.getElementById("produto-nome").value,
        codigo: document.getElementById("produto-codigo").value,
        categoria: document.getElementById("produto-categoria").value,
        estoque_atual: document.getElementById("produto-estoque").value,
        quantidade_minima: document.getElementById("produto-quantidade-minima").value,
        preco_atual: document.getElementById("produto-preco-atual").value,
        data_cadastro: document.getElementById("produto-data-cadastro").value,
        lote: document.getElementById("produto-lote").value,
        fornecedor: document.getElementById("produto-fornecedor").value,
        descricao: document.getElementById("produto-descricao").value,
        cep: document.getElementById("produto-cep").value
    };

    try {
        const response = await fetch('/produto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Produto cadastrado com sucesso!");
            document.querySelector('form[method="post"]').reset();
            listarProdutos();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar produto.");
    }
}

// Função para carregar fornecedores no select do formulário de cadastro
async function carregarFornecedores() {
    try {
        const response = await fetch('/fornecedores');

        if (!response.ok) {
            throw new Error('Erro ao buscar fornecedores');
        }

        const fornecedores = await response.json();
        const selectFornecedor = document.getElementById('produto-fornecedor');

        selectFornecedor.innerHTML = '<option value="">Selecione um fornecedor</option>';

        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.id;
            option.textContent = fornecedor.nome;
            selectFornecedor.appendChild(option);
        });

    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
        alert('Erro ao carregar lista de fornecedores');
    }
}

// Função corrigida para listar produtos
async function listarProdutos() {
    const codigo = document.getElementById('buscar-produto').value.trim();

    let url = '/produtos';

    if (codigo) {
        url += `?produto-codigo=${codigo}`;
    }

    try {
        const response = await fetch(url);
        const produtos = await response.json();

        const tabela = document.getElementById('tabela-produtos');
        tabela.innerHTML = '';

        if (produtos.length === 0) {
            tabela.innerHTML = '<tr><td colspan="7">Nenhum produto encontrado.</td></tr>';
        } else {
            produtos.forEach(produto => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${produto.prod_id_seq}</td>
                    <td>${produto.prod_nome}</td>
                    <td>${produto.prod_codigo_barra}</td>
                    <td>${produto.prod_categoria}</td>
                    <td>${produto.prod_estoque_atual}</td>
                    <td>R$ ${parseFloat(produto.prod_preco_atual).toFixed(2)}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
    }
}

// Inicializar quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    carregarFornecedores();
    aplicarMascaras();
});

window.onload = function() {
    listarProdutos();
    carregarFornecedores();
    aplicarMascaras();
};
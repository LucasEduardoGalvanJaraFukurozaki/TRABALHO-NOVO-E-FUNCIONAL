//.//////////////////////////////////////////////////////////FUNÇÃO MENU///////////////////////////////////////////////////////////
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');

    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');

    // Previne o scroll do body quando o menu está aberto
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

// Fecha o menu quando a tela é redimensionada para desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

// Fecha o menu ao pressionar ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

////////////////////////////////////////////////////////////CARREGAR DADOS///////////////////////////////////////////////////////////

// Função para carregar fornecedores
async function carregarFornecedores() {
    
    try {
        const response = await fetch('/fornecedores');
        if (!response.ok) {
            throw new Error('Erro ao buscar fornecedores');
        }
        const fornecedores = await response.json();

        // Atualiza o select de fornecedor (entrada)
        const selectFornecedorEntrada = document.getElementById('fornecedor');
        
        if (selectFornecedorEntrada) {
            selectFornecedorEntrada.innerHTML = '<option value="">Selecione um fornecedor</option>';
            fornecedores.forEach(fornecedor => {
                const option = document.createElement('option');
                option.value = fornecedor.id;
                option.textContent = `${fornecedor.nome} - CNPJ: ${fornecedor.cnpj}`;
                selectFornecedorEntrada.appendChild(option);
            });
        }

        // Atualiza o select de fornecedor (devolução)
        const selectFornecedorDevolucao = document.getElementById('produto-fornecedor');
        if (selectFornecedorDevolucao) {
            selectFornecedorDevolucao.innerHTML = '<option value="">Selecione um fornecedor</option>';
            fornecedores.forEach(fornecedor => {
                const option = document.createElement('option');
                option.value = fornecedor.id;
                option.textContent = `${fornecedor.nome} - CNPJ: ${fornecedor.cnpj}`;
                selectFornecedorDevolucao.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
        alert('Erro ao carregar lista de fornecedores');
    }
}

// Função para carregar funcionários
async function carregarFuncionarios() {
    try {
        const response = await fetch('/funcionarios');
        if (!response.ok) {
            throw new Error('Erro ao buscar funcionários');
        }
        const funcionarios = await response.json();
        const selectResponsavel = document.getElementById('responsavel');

        if (selectResponsavel) {
            selectResponsavel.innerHTML = '<option value="">Selecione um funcionário</option>';
            funcionarios.forEach(func => {
                const option = document.createElement('option');
                option.value = func.func_id;
                option.textContent = `${func.func_nome} - ${func.func_cargo}`;
                selectResponsavel.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
        alert('Erro ao carregar lista de funcionários');
    }
}

// Função para carregar produtos (medicamentos)
async function carregarProdutos() {
    try {
        const response = await fetch('/produtos');
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        const produtos = await response.json();
        const selectMedicamento = document.getElementById('medicamento_ajuste');

        if (selectMedicamento) {
            selectMedicamento.innerHTML = '<option value="">Selecione um medicamento</option>';
            produtos.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.prod_id_seq;
                option.textContent = `${produto.prod_nome} - Estoque: ${produto.prod_estoque_atual}`;
                option.dataset.estoque = produto.prod_estoque_atual;
                selectMedicamento.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar lista de produtos');
    }
}

async function cadastrarMovimento(event) {
    event.preventDefault();

    const tipoMovimento = document.getElementById('tipo_movimento').value;
    const dataMovimento = document.getElementById('data_movimento').value;
    const responsavel = document.getElementById('responsavel').value;
    const observacao = document.getElementById('observacao').value;

    if (!tipoMovimento || !dataMovimento || !responsavel) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    // Monta objeto com dados do movimento
    const movimento = {
        tipo: tipoMovimento,
        data: dataMovimento,
        responsavel: responsavel,
        observacao: observacao
    };

    // Adiciona campos específicos conforme o tipo
    switch(tipoMovimento) {
        case 'entrada':
            movimento.notaFiscal = document.getElementById('nota_fiscal').value;
            movimento.fornecedor = document.getElementById('fornecedor').value;
            break;
        case 'saida':
            movimento.motivoSaida = document.getElementById('motivo_saida').value;
            break;
        case 'ajuste':
            movimento.medicamento = document.getElementById('medicamento_ajuste').value;
            movimento.quantidade = document.getElementById('quantidade_ajuste').value;
            movimento.justificativa = document.getElementById('justificativa_ajuste').value;
            break;
        case 'devolucao':
            movimento.fornecedor = document.getElementById('produto-fornecedor').value;
            movimento.motivoDevolucao = document.getElementById('motivo_devolucao').value;
            break;
        case 'perda':
            movimento.motivoAjuste = document.getElementById('motivo_ajuste').value;
            break;
    }

    try {
        const response = await fetch("/movimento", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(movimento),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Movimento cadastrado com sucesso!");
            document.querySelector("form").reset();
            listarMovimento(); // Atualiza a listagem
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar Movimento.");
    }
}

async function listarMovimento(event) {
    if (event) event.preventDefault();

    let url = '/movimento';

    try {
        const response = await fetch(url);
        const movimentos = await response.json();

        const tbody = document.querySelector('#tabela-movimento tbody');
        tbody.innerHTML = '';

        if (movimentos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">Nenhum movimento encontrado.</td></tr>';
        } else {
            movimentos.forEach(mov => {
                const linha = document.createElement('tr');

                // Formata a data
                const dataFormatada = new Date(mov.mov_data).toLocaleString('pt-BR');

                // Define descrição baseada no tipo
                let descricao = '';
                switch(mov.mov_tipo) {
                    case 'entrada':
                        descricao = `${mov.mov_nota_fiscal || 'N/A'}`;
                        break;
                    case 'saida':
                        descricao = `${mov.mov_motivo_saida || 'N/A'}`;
                        break;
                    case 'ajuste':
                        descricao = `${mov.mov_quantidade || 0}`;
                        break;
                    case 'devolucao':
                        descricao = `${mov.mov_motivo_devolucao || 'N/A'}`;
                        break;
                    case 'perda':
                        descricao = `${mov.mov_motivo_ajuste || 'N/A'}`;
                        break;
                }

                linha.innerHTML = `
                    <td>${mov.mov_id}</td>
                    <td>${mov.mov_tipo.toUpperCase()}</td>
                    <td>${dataFormatada}</td>
                    <td>${mov.mov_responsavel}</td>
                    <td>${descricao}</td>
                    <td>${mov.mov_observacao || '-'}</td>
                    <td>
                        <button(${mov.mov_id})"</button>
                    </td>
                `;
                tbody.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar movimentos:', error);
        alert('Erro ao carregar movimentos');
    }
}
// Script para exibir/esconder campos conforme o tipo de movimento
document.getElementById("tipo_movimento").addEventListener("change", function() {
    // Esconde todos os campos específicos
    document.querySelectorAll(".tipo-campos").forEach(c => c.style.display = "none");

    let selecionado = this.value;
    if(selecionado) {
        const campoSelecionado = document.getElementById(selecionado + "_campos");
        if (campoSelecionado) {
            campoSelecionado.style.display = "block";
        }
    }
});


// Validação de quantidade no ajuste (verifica estoque disponível)
document.getElementById('medicamento_ajuste')?.addEventListener('change', function() {
    const estoqueAtual = this.options[this.selectedIndex]?.dataset.estoque || 0;
    const inputQuantidade = document.getElementById('quantidade_ajuste');

    if (inputQuantidade) {
        inputQuantidade.setAttribute('data-estoque-atual', estoqueAtual);
        inputQuantidade.placeholder = `Estoque atual: ${estoqueAtual}`;
    }
});

document.getElementById('quantidade_ajuste')?.addEventListener('input', function() {
    const estoqueAtual = parseInt(this.getAttribute('data-estoque-atual') || 0);
    const quantidade = parseInt(this.value || 0);

    // Se for ajuste negativo, verifica se não ultrapassa o estoque
    if (quantidade < 0 && Math.abs(quantidade) > estoqueAtual) {
        this.setCustomValidity(`Não é possível retirar mais do que o estoque atual (${estoqueAtual})`);
    } else {
        this.setCustomValidity('');
    }e
});

////////////////////////////////////////////////////////////SUBMISSÃO DO FORMULÁRIO///////////////////////////////////////////////////////////

// Intercepta o envio do formulário
document.querySelector('form')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const tipoMovimento = document.getElementById('tipo_movimento').value;
    const dataMovimento = document.getElementById('data_movimento').value;
    const responsavel = document.getElementById('responsavel').value;
    const observacao = document.getElementById('observacao').value;

    if (!tipoMovimento || !dataMovimento || !responsavel) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    // Monta objeto com dados do movimento
    const movimento = {
        tipo: tipoMovimento,
        data: dataMovimento,
        responsavel: responsavel,
        observacao: observacao
    };

    // Adiciona campos específicos conforme o tipo
    switch(tipoMovimento) {
        case 'entrada':
            movimento.notaFiscal = document.getElementById('nota_fiscal').value;
            movimento.fornecedor = document.getElementById('fornecedor').value;
            break;
        case 'saida':
            movimento.motivoSaida = document.getElementById('motivo_saida').value;
            break;
        case 'ajuste':
            movimento.medicamento = document.getElementById('medicamento_ajuste').value;
            movimento.quantidade = document.getElementById('quantidade_ajuste').value;
            movimento.justificativa = document.getElementById('justificativa_ajuste').value;
            break;
        case 'devolucao':
            movimento.fornecedor = document.getElementById('produto-fornecedor').value;
            movimento.motivoDevolucao = document.getElementById('motivo_devolucao').value;
            break;
        case 'perda':
            movimento.motivoAjuste = document.getElementById('motivo_ajuste').value;
            break;
    }

    console.log('Dados do movimento:', movimento);
    e
    // Aqui você pode enviar para o backend quando implementar a rota
    /*
    try {
        const response = await fetch('/movimento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movimento)
        });

        if (response.ok) {
            alert('Movimento registrado com sucesso!');
            this.reset();
        } else {
            alert('Erro ao registrar movimento');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar dados');
    }
    */

    alert('Movimento registrado (aguardando implementação da rota no backend)');
});

////////////////////////////////////////////////////////////INICIALIZAÇÃO///////////////////////////////////////////////////////////

// Carrega os dados quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    carregarFornecedores();
    carregarFuncionarios();
    carregarProdutos();

    // Define a data/hora atual como padrão
    const dataInput = document.getElementById('data_movimento');
    if (dataInput) {
        const agora = new Date();
        const dataFormatada = agora.toISOString().slice(0, 16);
        dataInput.value = dataFormatada;
    }
});
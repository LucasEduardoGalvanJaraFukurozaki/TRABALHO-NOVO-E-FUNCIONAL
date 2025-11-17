////////////////////////////////////////////////////////////MÁSCARAS DE INPUT///////////////////////////////////////////////////////////

// Máscara para CPF (000.000.000-00)
function mascaraCPF(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = valor;
}

// Máscara para Telefone (00) 00000-0000 ou (00) 0000-0000
function mascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length <= 10) {
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    }
    input.value = valor;
}

// Máscara para CEP (00000-000)
function mascaraCEP(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    input.value = valor;
}

// Aplicar máscaras aos inputs quando carrega a página
document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.getElementById('cliente-cpf');
    const telefoneInput = document.getElementById('cliente-telefone');
    const cepInput = document.getElementById('cliente-cep');
    const buscarClienteInput = document.getElementById('buscar-cliente');

    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            mascaraCPF(this);
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function() {
            mascaraTelefone(this);
        });
    }

    if (cepInput) {
        cepInput.addEventListener('input', function() {
            mascaraCEP(this);
        });
        // Busca CEP quando terminar de digitar
        cepInput.addEventListener('blur', function() {
            buscarCEP(this.value);
        });
    }

    if (buscarClienteInput) {
        buscarClienteInput.addEventListener('input', function() {
            mascaraCPF(this);
        });
    }
});

////////////////////////////////////////////////////////////BUSCA CEP///////////////////////////////////////////////////////////

async function buscarCEP(cep) {
    // Remove caracteres não numéricos
    cep = cep.replace(/\D/g, '');

    // Verifica se o CEP tem 8 dígitos
    if (cep.length !== 8) {
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();

        if (dados.erro) {
            alert('CEP não encontrado!');
            limparEndereco();
            return;
        }

        // Preenche os campos com os dados retornados
        document.getElementById('cliente-logradouro').value = dados.logradouro || '';
        document.getElementById('cliente-bairro').value = dados.bairro || '';
        document.getElementById('cliente-cidade').value = dados.localidade || '';
        document.getElementById('cliente-estado').value = dados.uf || '';

        // Foca no campo número após preencher o endereço
        document.getElementById('cliente-numero').focus();

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Tente novamente.');
    }
}

function limparEndereco() {
    document.getElementById('cliente-logradouro').value = '';
    document.getElementById('cliente-bairro').value = '';
    document.getElementById('cliente-cidade').value = '';
    document.getElementById('cliente-estado').value = '';
}

////////////////////////////////////////////////////////////FUNÇÃO MENU///////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////FUNÇÃO CADASTRO///////////////////////////////////////////////////////////

async function cadastrarCliente(event) {
    event.preventDefault();

    const cliente = {
        nome: document.getElementById("cliente-nome").value,
        cpf: document.getElementById("cliente-cpf").value.replace(/\D/g, ''), // Remove formatação
        email: document.getElementById("cliente-email").value,
        telefone: document.getElementById("cliente-telefone").value.replace(/\D/g, ''), // Remove formatação
        logradouro: document.getElementById("cliente-logradouro").value,
        numero: document.getElementById("cliente-numero").value,
        complemento: document.getElementById("cliente-complemento").value,
        bairro: document.getElementById("cliente-bairro").value,
        cidade: document.getElementById("cliente-cidade").value,
        estado: document.getElementById("cliente-estado").value,
        cep: document.getElementById("cliente-cep").value.replace(/\D/g, '') // Remove formatação
    };

    try {
        const response = await fetch("/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cliente),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Cliente cadastrado com sucesso!");
            document.querySelector("form").reset();
            listarClientes();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar cliente.");
    }
}

// Função para listar todos os clientes ou buscar clientes por CPF
async function listarClientes() {
    const cpf = document.getElementById('buscar-cliente').value.replace(/\D/g, ''); // Remove formatação

    let url = '/clientes';

    if (cpf) {
        url += `?cpf=${cpf}`;
    }

    try {
        const response = await fetch(url);
        const clientes = await response.json();

        const tabela = document.getElementById('tabela-clientes');
        tabela.innerHTML = '';

        if (clientes.length === 0) {
            tabela.innerHTML = '<tr><td colspan="6">Nenhum cliente encontrado.</td></tr>';
        } else {
            clientes.forEach(cliente => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${cliente.id}</td>
                    <td>${cliente.nome}</td>
                    <td>${formatarCPF(cliente.cpf)}</td>
                    <td>${cliente.email}</td>
                    <td>${formatarTelefone(cliente.telefone)}</td>
                    <td>${cliente.cidade}/${cliente.estado}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
    }
}

// Funções auxiliares para formatação na exibição
function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone) {
    if (telefone.length === 11) {
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
        return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
}

//////////////////////////////////////////////////////////FUNÇÃO ATUALIZAR///////////////////////////////////////////////////////////

async function atualizarCliente() {
    const nome = document.getElementById("cliente-nome").value;
    const telefone = document.getElementById("cliente-telefone").value.replace(/\D/g, '');
    const email = document.getElementById("cliente-email").value;
    const cpf = document.getElementById("cliente-cpf").value.replace(/\D/g, '');
    const logradouro = document.getElementById("cliente-logradouro").value;
    const numero = document.getElementById("cliente-numero").value;
    const complemento = document.getElementById("cliente-complemento").value;
    const bairro = document.getElementById("cliente-bairro").value;
    const cidade = document.getElementById("cliente-cidade").value;
    const estado = document.getElementById("cliente-estado").value;
    const cep = document.getElementById("cliente-cep").value.replace(/\D/g, '');

    const clienteAtualizado = {
        nome,
        cpf,
        email,
        telefone,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep
    };

    try {
        const response = await fetch(`/clientes/cpf/${cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteAtualizado)
        });

        if (response.ok) {
            alert('Cliente atualizado com sucesso!');
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar cliente: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        alert('Erro ao atualizar cliente.');
    }
}

async function limpaCliente() {
    document.getElementById('cliente-nome').value = '';
    document.getElementById('cliente-cpf').value = '';
    document.getElementById('cliente-email').value = '';
    document.getElementById('cliente-telefone').value = '';
    document.getElementById('cliente-logradouro').value = '';
    document.getElementById('cliente-numero').value = '';
    document.getElementById('cliente-complemento').value = '';
    document.getElementById('cliente-bairro').value = '';
    document.getElementById('cliente-cidade').value = '';
    document.getElementById('cliente-estado').value = '';
    document.getElementById('cliente-cep').value = '';
}
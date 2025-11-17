////////////////////////////////////////////////////////////MÁSCARAS DE INPUT///////////////////////////////////////////////////////////

// Máscara para CNPJ (00.000.000/0000-00)
function mascaraCNPJ(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
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
    const cnpjInput = document.getElementById('fornecedor-cnpj');
    const telefoneInput = document.getElementById('fornecedor-telefone');
    const contatoTelefoneInput = document.getElementById('fornecedor-contato-telefone');
    const cepInput = document.getElementById('fornecedor-cep');
    const buscarFornecedorInput = document.getElementById('buscar-fornecedor');

    if (cnpjInput) {
        cnpjInput.addEventListener('input', function() {
            mascaraCNPJ(this);
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function() {
            mascaraTelefone(this);
        });
    }

    if (contatoTelefoneInput) {
        contatoTelefoneInput.addEventListener('input', function() {
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

    if (buscarFornecedorInput) {
        buscarFornecedorInput.addEventListener('input', function() {
            mascaraCNPJ(this);
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
        document.getElementById('fornecedor-logradouro').value = dados.logradouro || '';
        document.getElementById('fornecedor-bairro').value = dados.bairro || '';
        document.getElementById('fornecedor-cidade').value = dados.localidade || '';
        document.getElementById('fornecedor-estado').value = dados.uf || '';

        // Foca no campo número após preencher o endereço
        document.getElementById('fornecedor-numero').focus();

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Tente novamente.');
    }
}

function limparEndereco() {
    document.getElementById('fornecedor-logradouro').value = '';
    document.getElementById('fornecedor-bairro').value = '';
    document.getElementById('fornecedor-cidade').value = '';
    document.getElementById('fornecedor-estado').value = '';
}

// Funções auxiliares para formatação na exibição
function formatarCNPJ(cnpj) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function formatarTelefone(telefone) {
    if (telefone.length === 11) {
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
        return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
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

////////////////////////////////////////////////////////////////FUNÇÃO CADASTRO///////////////////////////////////////////////////////////

async function cadastrarFornecedor(event) {
    event.preventDefault();

    const fornecedor = {
        nome: document.getElementById("fornecedor-nome").value,
        cnpj: document.getElementById("fornecedor-cnpj").value.replace(/\D/g, ''), // Remove formatação
        telefone: document.getElementById("fornecedor-telefone").value.replace(/\D/g, ''), // Remove formatação
        email: document.getElementById("fornecedor-email").value,
        cep: document.getElementById("fornecedor-cep").value.replace(/\D/g, ''), // Remove formatação
        logradouro: document.getElementById("fornecedor-logradouro").value,
        numero: document.getElementById("fornecedor-numero").value,
        complemento: document.getElementById("fornecedor-complemento").value,
        bairro: document.getElementById("fornecedor-bairro").value,
        cidade: document.getElementById("fornecedor-cidade").value,
        estado: document.getElementById("fornecedor-estado").value,
        contatoNome: document.getElementById("fornecedor-contato-nome").value,
        contatoCargo: document.getElementById("fornecedor-contato-cargo").value,
        contatoTelefone: document.getElementById("fornecedor-contato-telefone").value.replace(/\D/g, ''), // Remove formatação
        contatoEmail: document.getElementById("fornecedor-contato-email").value,
    };

    try {
        const response = await fetch("/fornecedores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fornecedor),
        });
        const result = await response.json();
        if (response.ok) {
            alert("Fornecedor cadastrado com sucesso!");
            document.getElementById("fornecedor-form").reset();
            listarFornecedores();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar fornecedor.");
    }
}

async function listarFornecedores() {
    const cnpj = document.getElementById("buscar-fornecedor").value.replace(/\D/g, ''); // Remove formatação
    let url = "/fornecedores";

    if (cnpj) {
        url += `?cnpj=${cnpj}`;
    }

    try {
        const response = await fetch(url);
        const fornecedores = await response.json();
        const tabela = document.getElementById("tabela-fornecedores");
        tabela.innerHTML = "";

        if (fornecedores.length === 0) {
            tabela.innerHTML =
                '<tr><td colspan="8">Nenhum fornecedor encontrado.</td></tr>';
        } else {
            fornecedores.forEach((fornecedor) => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${fornecedor.id}</td>
                    <td>${fornecedor.nome}</td>
                    <td>${formatarCNPJ(fornecedor.cnpj)}</td>
                    <td>${formatarTelefone(fornecedor.telefone)}</td>
                    <td>${fornecedor.email}</td>
                    <td>${fornecedor.cidade}/${fornecedor.estado}</td>
                    <td>${fornecedor.contatoNome}/${formatarTelefone(fornecedor.contatoTelefone)}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error("Erro ao listar fornecedores:", error);
    }
}

////////////////////////////////////////////////////////////////FUNÇÃO ATUALIZAR///////////////////////////////////////////////////////////

async function atualizarFornecedor() {
    const nome = document.getElementById("fornecedor-nome").value;
    const cnpj = document.getElementById("fornecedor-cnpj").value.replace(/\D/g, ''); // Remove formatação
    const telefone = document.getElementById("fornecedor-telefone").value.replace(/\D/g, ''); // Remove formatação
    const email = document.getElementById("fornecedor-email").value;
    const cep = document.getElementById("fornecedor-cep").value.replace(/\D/g, ''); // Remove formatação
    const logradouro = document.getElementById("fornecedor-logradouro").value;
    const numero = document.getElementById("fornecedor-numero").value;
    const complemento = document.getElementById("fornecedor-complemento").value;
    const bairro = document.getElementById("fornecedor-bairro").value;
    const cidade = document.getElementById("fornecedor-cidade").value;
    const estado = document.getElementById("fornecedor-estado").value;
    const contatoNome = document.getElementById("fornecedor-contato-nome").value;
    const contatoCargo = document.getElementById("fornecedor-contato-cargo").value;
    const contatoTelefone = document.getElementById("fornecedor-contato-telefone").value.replace(/\D/g, ''); // Remove formatação
    const contatoEmail = document.getElementById("fornecedor-contato-email").value;

    const fornecedorAtualizado = {
        nome,
        cnpj,
        telefone,
        email,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        contatoNome,
        contatoCargo,
        contatoTelefone,
        contatoEmail,
    };

    try {
        const response = await fetch(`/fornecedores/cnpj/${cnpj}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fornecedorAtualizado),
        });

        if (response.ok) {
            alert("Fornecedor atualizado com sucesso!");
            listarFornecedores();
        } else {
            const errorMessage = await response.text();
            alert("Erro ao atualizar fornecedor: " + errorMessage);
        }
    } catch (error) {
        console.error("Erro ao atualizar fornecedor:", error);
        alert("Erro ao atualizar fornecedor.");
    }
}

async function limpaFornecedor() {
    document.getElementById("fornecedor-nome").value = "";
    document.getElementById("fornecedor-cnpj").value = "";
    document.getElementById("fornecedor-telefone").value = "";
    document.getElementById("fornecedor-email").value = "";
    document.getElementById("fornecedor-cep").value = "";
    document.getElementById("fornecedor-logradouro").value = "";
    document.getElementById("fornecedor-numero").value = "";
    document.getElementById("fornecedor-complemento").value = "";
    document.getElementById("fornecedor-bairro").value = "";
    document.getElementById("fornecedor-cidade").value = "";
    document.getElementById("fornecedor-estado").value = "";
    document.getElementById("fornecedor-contato-nome").value = "";
    document.getElementById("fornecedor-contato-cargo").value = "";
    document.getElementById("fornecedor-contato-telefone").value = "";
    document.getElementById("fornecedor-contato-email").value = "";
}

async function editarFornecedor(cnpj) {
    try {
        const response = await fetch(`/fornecedores?cnpj=${cnpj}`);
        const fornecedores = await response.json();

        if (fornecedores.length > 0) {
            const fornecedor = fornecedores[0];

            document.getElementById("fornecedor-nome").value = fornecedor.nome;
            document.getElementById("fornecedor-cnpj").value = formatarCNPJ(fornecedor.cnpj);
            document.getElementById("fornecedor-telefone").value = formatarTelefone(fornecedor.telefone);
            document.getElementById("fornecedor-email").value = fornecedor.email;
            document.getElementById("fornecedor-cep").value = fornecedor.cep.replace(/(\d{5})(\d{3})/, '$1-$2');
            document.getElementById("fornecedor-logradouro").value = fornecedor.logradouro;
            document.getElementById("fornecedor-numero").value = fornecedor.numero;
            document.getElementById("fornecedor-complemento").value = fornecedor.complemento;
            document.getElementById("fornecedor-bairro").value = fornecedor.bairro;
            document.getElementById("fornecedor-cidade").value = fornecedor.cidade;
            document.getElementById("fornecedor-estado").value = fornecedor.estado;
            document.getElementById("fornecedor-contato-nome").value = fornecedor.contatoNome;
            document.getElementById("fornecedor-contato-cargo").value = fornecedor.contatoCargo;
            document.getElementById("fornecedor-contato-telefone").value = formatarTelefone(fornecedor.contatoTelefone);
            document.getElementById("fornecedor-contato-email").value = fornecedor.contatoEmail;
            document.getElementById("btn-salvar").style.display = "none";
            document.getElementById("btn-atualizar").style.display = "inline-block";
            document.getElementById("btn-cancelar").style.display = "inline-block";

            document.getElementById("fornecedor-cnpj").readOnly = true;
        }
    } catch (error) {
        console.error("Erro ao carregar fornecedor:", error);
        alert("Erro ao carregar dados do fornecedor.");
    }
}

function cancelarEdicao() {
    limpaFornecedor();
    document.getElementById("btn-salvar").style.display = "inline-block";
    document.getElementById("btn-atualizar").style.display = "none";
    document.getElementById("btn-cancelar").style.display = "none";
    document.getElementById("fornecedor-cnpj").readOnly = false;
}
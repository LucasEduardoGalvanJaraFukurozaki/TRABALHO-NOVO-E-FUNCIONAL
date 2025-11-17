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

//////////////////////////////////////////////////////////MÁSCARAS DE INPUT///////////////////////////////////////////////////////////
function aplicarMascaraCPF(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = valor;
}

function aplicarMascaraTelefone(input) {
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

function aplicarMascaraCEP(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    input.value = valor;
}

function aplicarMascaraSalario(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = (parseFloat(valor) / 100).toFixed(2);
    valor = valor.replace('.', ',');
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    input.value = 'R$ ' + valor;
}

// Inicializa as máscaras quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.getElementById('funcionario-cpf');
    const telefoneInput = document.getElementById('funcionario-telefone');
    const cepInput = document.getElementById('funcionario-cep');
    const salarioInput = document.getElementById('funcionario-salario');
    const cpfBuscaInput = document.getElementById('buscar-funcionario');

    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            aplicarMascaraCPF(this);
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function() {
            aplicarMascaraTelefone(this);
        });
    }

    if (cepInput) {
        cepInput.addEventListener('input', function() {
            aplicarMascaraCEP(this);
        });

        // Busca CEP quando completar o preenchimento
        cepInput.addEventListener('blur', function() {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                buscarCEP(cep);
            }
        });
    }

    if (salarioInput) {
        salarioInput.addEventListener('input', function() {
            aplicarMascaraSalario(this);
        });
    }

    if (cpfBuscaInput) {
        cpfBuscaInput.addEventListener('input', function() {
            aplicarMascaraCPF(this);
        });
    }
});

//////////////////////////////////////////////////////////FUNÇÃO BUSCAR CEP///////////////////////////////////////////////////////////
async function buscarCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert('CEP não encontrado!');
            return;
        }

        // Preenche os campos com os dados do CEP
        document.getElementById('funcionario-logradouro').value = data.logradouro || '';
        document.getElementById('funcionario-bairro').value = data.bairro || '';
        document.getElementById('funcionario-cidade').value = data.localidade || '';
        document.getElementById('funcionario-estado').value = data.uf || '';

        // Foca no campo número após preencher o endereço
        document.getElementById('funcionario-numero').focus();
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Tente novamente.');
    }
}

//////////////////////////////////////////////////////////FUNÇÃO CADASTRO///////////////////////////////////////////////////////////
async function cadastrarFuncionario(event) {
    event.preventDefault();

    const funcionario = {
        func_nome: document.getElementById("funcionario-nome").value,
        func_cpf: document.getElementById("funcionario-cpf").value.replace(/\D/g, ''),
        func_email: document.getElementById("funcionario-email").value,
        func_telefone: document.getElementById("funcionario-telefone").value.replace(/\D/g, ''),    
        func_logradouro: document.getElementById("funcionario-logradouro").value,
        func_numero: document.getElementById("funcionario-numero").value,
        func_complemento: document.getElementById("funcionario-complemento").value,
        func_bairro: document.getElementById("funcionario-bairro").value,
        func_cidade: document.getElementById("funcionario-cidade").value,
        func_estado: document.getElementById("funcionario-estado").value,
        func_cep: document.getElementById("funcionario-cep").value.replace(/\D/g, ''),
        func_cargo: document.getElementById("funcionario-cargo").value,
        func_salario: document.getElementById("funcionario-salario").value.replace(/[R$\s.]/g, '').replace(',', '.')
    };

    try {
        const response = await fetch("/funcionario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(funcionario),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Funcionario cadastrado com sucesso!");
            document.querySelector(".form-funcionario").reset();
            listarFuncionarios();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar funcionario.");
    }
}

async function listarFuncionarios() {
    const cpf = document.getElementById('buscar-funcionario').value.replace(/\D/g, '');

    let url = '/funcionarios';

    if (cpf) {
        url += `?cpf=${cpf}`;
    }

    try {
        const response = await fetch(url);
        const funcionarios = await response.json();

        const tabela = document.querySelector('.tabela-funcionarios');
        tabela.innerHTML = '';

        if (funcionarios.length === 0) {
            tabela.innerHTML = '<tr><td colspan="7">Nenhum funcionario encontrado.</td></tr>';
        } else {
            funcionarios.forEach(funcionario => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${funcionario.func_id}</td>
                    <td>${funcionario.func_nome}</td>
                    <td>${formatarCPF(funcionario.func_cpf)}</td>
                    <td>${formatarTelefone(funcionario.func_telefone)}</td>
                    <td>${funcionario.func_email}</td>
                    <td>${funcionario.func_cargo}</td>
                    <td data-label="Ações">
                        <div class="action-btns">
                            <button class="edit-btn" onclick="editarFuncionario('${funcionario.func_cpf}')" title="Editar funcionario">
                                Editar
                            </button>
                        </div>
                    </td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar funcionarios:', error);
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

async function atualizarFuncionario() {
    const func_nome = document.getElementById("funcionario-nome").value;
    const func_cpf = document.getElementById("funcionario-cpf").value.replace(/\D/g, '');
    const func_email = document.getElementById("funcionario-email").value;
    const func_telefone = document.getElementById("funcionario-telefone").value.replace(/\D/g, '');
    const func_logradouro = document.getElementById("funcionario-logradouro").value;
    const func_numero = document.getElementById("funcionario-numero").value;
    const func_complemento = document.getElementById("funcionario-complemento").value;
    const func_bairro = document.getElementById("funcionario-bairro").value;
    const func_cidade = document.getElementById("funcionario-cidade").value;
    const func_estado = document.getElementById("funcionario-estado").value;
    const func_cep = document.getElementById("funcionario-cep").value.replace(/\D/g, '');
    const func_cargo = document.getElementById("funcionario-cargo").value;
    const func_salario = document.getElementById("funcionario-salario").value.replace(/[R$\s.]/g, '').replace(',', '.');

    const funcionarioAtualizado = {
        func_nome,
        func_cpf,
        func_email,
        func_telefone,
        func_logradouro,
        func_numero,
        func_complemento,
        func_bairro,
        func_cidade,
        func_estado,
        func_cep,
        func_cargo,
        func_salario
    };

    try {
        const response = await fetch(`/funcionarios/cpf/${func_cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionarioAtualizado)
        });

        if (response.ok) {
            alert('Funcionario atualizado com sucesso!');
            listarFuncionarios();
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar funcionario: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar funcionario:', error);
        alert('Erro ao atualizar funcionario.');
    }
}

async function editarFuncionario(cpf) {
    try {
        const response = await fetch(`/funcionarios?cpf=${cpf}`);
        const funcionarios = await response.json();

        if (funcionarios.length > 0) {
            const funcionario = funcionarios[0];

            document.getElementById("funcionario-nome").value = funcionario.func_nome;
            document.getElementById("funcionario-cpf").value = formatarCPF(funcionario.func_cpf);
            document.getElementById("funcionario-email").value = funcionario.func_email;
            document.getElementById("funcionario-telefone").value = formatarTelefone(funcionario.func_telefone);
            document.getElementById("funcionario-logradouro").value = funcionario.func_logradouro;
            document.getElementById("funcionario-numero").value = funcionario.func_numero;
            document.getElementById("funcionario-complemento").value = funcionario.func_complemento;
            document.getElementById("funcionario-bairro").value = funcionario.func_bairro;
            document.getElementById("funcionario-cidade").value = funcionario.func_cidade;
            document.getElementById("funcionario-estado").value = funcionario.func_estado;
            document.getElementById("funcionario-cep").value = funcionario.func_cep.replace(/(\d{5})(\d{3})/, '$1-$2');
            document.getElementById("funcionario-cargo").value = funcionario.func_cargo;

            // Formata o salário para exibição
            const salarioFormatado = parseFloat(funcionario.func_salario).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            document.getElementById("funcionario-salario").value = 'R$ ' + salarioFormatado;
        }
    } catch (error) {
        console.error("Erro ao carregar funcionario:", error);
        alert("Erro ao carregar dados do funcionario.");
    }
}

async function limpaFuncionario() {
    document.getElementById('funcionario-nome').value = '';
    document.getElementById('funcionario-cpf').value = '';
    document.getElementById('funcionario-email').value = '';
    document.getElementById('funcionario-telefone').value = '';
    document.getElementById('funcionario-logradouro').value = '';
    document.getElementById('funcionario-numero').value = '';
    document.getElementById('funcionario-complemento').value = '';
    document.getElementById('funcionario-bairro').value = '';
    document.getElementById('funcionario-cidade').value = '';
    document.getElementById('funcionario-estado').value = '';
    document.getElementById('funcionario-cep').value = '';
    document.getElementById('funcionario-cargo').value = '';
    document.getElementById('funcionario-salario').value = '';
}
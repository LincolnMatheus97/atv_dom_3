// --- Utils ---

function getById(id) {
    return document.getElementById(id);
}

function query(selector) {
    return document.querySelector(selector);
}

function getBotaoClicavel(id, funcao) {
    getById(id).addEventListener('click', funcao);
    return getById(id);
}

function getTeclaEnter(id, funcao) {
    getById(id).addEventListener('keypress', funcao);
    return getById(id);
}

// --- Elementos Selecionados (DOM) ---

const descricaoTarefaInput = getById('descricaoTarefa')
const adicionarBtn = getById('adicionarBtn')
const tabelaTarefasBody = query('#tabelaTarefas tbody')

// --- Banco de Dados ---

let idTarefas = 1;
let tarefas = [];

// --- Funções Principais ---
 
let btnAddTarefa = getBotaoClicavel('adicionarBtn', adicionarTarefa);
let addDescricaoTarefa = getTeclaEnter('descricaoTarefa', addTarefaComEnter);

// Função central que redesenha a tabela de tarefas com base no nosso banco de dados de tarefas
function renderizarTabela() {
    tabelaTarefasBody.innerHTML = '';

    tarefas.forEach(tarefa => {
        const tr = document.createElement('tr');

        // Pinta o fundo da tarefa se estiver concluída
        if (tarefa.dataConclusao) {
            tr.style.backgroundColor = '#d4edda';
        }

        tr.innerHTML = `
            <td>${tarefa.id}</td>
            <td>${tarefa.descricao}</td>
            <td>${tarefa.dataInicio}</td>
            <td>${tarefa.dataConclusao}</td>
            <td class="acoes"></td>
        `;

        const acoesCell = tr.querySelector('.acoes');

        // Adiciona os botões de ações (Reabrir, Excluir e Concluir)
        if (tarefa.dataConclusao) {
            const reabrirBtn = document.createElement('button');
            reabrirBtn.textContent = 'Reabrir';
            reabrirBtn.onclick = () => reabrirTarefa(tarefa.id);
            acoesCell.appendChild(reabrirBtn);
        } else {
            const concluirBtn = document.createElement('button');
            concluirBtn.textContent = 'Concluir';
            concluirBtn.className = 'concluirBtn';
            concluirBtn.onclick = () => concluirTarefa(tarefa.id);

            const excluirBtn = document.createElement('button');
            excluirBtn.textContent = 'Excluir';
            excluirBtn.className = 'excluirBtn';
            excluirBtn.onclick = () => excluirTarefa(tarefa.id);

            acoesCell.appendChild(concluirBtn);
            acoesCell.appendChild(excluirBtn);
        }

        tabelaTarefasBody.appendChild(tr);
    });
}

// Função para criar mensagem de erro
function criarErro(id, mensagem) {
    let mensagemErro = getById(id);
    mensagemErro.textContent = mensagem;
    mensagemErro.classList.remove('oculto');

    setTimeout(function() {
        mensagemErro.classList.add('oculto');
        mensagemErro.textContent = '';
    }, 3000);
}

// Função que cria nova tarefa, adiciona ao nosso banco de dados(array) e atualiza nossa tabela
function adicionarTarefa() {
    const descricao = descricaoTarefaInput.value.trim();

    // Verifica se existe uma descrição na caixa, senão, mostra mensagem de erro.
    if (!descricao) {
        criarErro('mensagemErro', 'Por favor, digite alguma descrição para a tarefa!');
        return;
    }

    // Verifica se a descrição existe na nossa tabela de tarefas, se existe, mostra mensagem de erro. 
    const descricaoExiste = tarefas.find(trf => trf.descricao.toLowerCase() === descricao.toLowerCase());
    if (descricaoExiste) {
        criarErro('mensagemErro',`Essa descrição já existe!`);
        return;
    }

    const novaTarefa = {
        id: idTarefas++,
        descricao: descricao,
        dataInicio: new Date().toLocaleDateString('pt-BR'),
        dataConclusao: ""
    };

    tarefas.push(novaTarefa);
    descricaoTarefaInput.value = '';
    renderizarTabela();
}

// Função que capta o click no "Enter" para adicionar nova tarefa
function addTarefaComEnter(evento) {
    if (evento.key === 'Enter') {
        adicionarTarefa();
    }
}

// Função que limpa a data de conclução, tornando a tarefa pendente novamente
function reabrirTarefa(id) {
    const tarefaReaberta = tarefas.find(trf => trf.id === id);
    if (tarefaReaberta) {
        tarefaReaberta.dataConclusao = "";
        renderizarTabela();
    }
}

// Função que marca a tarefa como concluída, registrando sua data de conclusão
function concluirTarefa(id) {
    const tarefaConcluida = tarefas.find(trf => trf.id === id);
    if (tarefaConcluida) {
        tarefaConcluida.dataConclusao = new Date().toLocaleDateString('pt-BR');
        renderizarTabela();
    }
}

// Função que exclui tarefa do nosso banco(array) e atualiza nossa tabela
function excluirTarefa(id) {
    const confirmacao = confirm('Você deseja mesmo excluir essa tarefa?');
    if (confirmacao) {
        tarefas = tarefas.filter(trf => trf.id !== id);
        renderizarTabela();
    }
}

// Chamamos a função para renderizar tabela pela primeira vez, para garantir que ela sempre esteja montada.
renderizarTabela();
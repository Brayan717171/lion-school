// ==========================================
// CONFIG
// ==========================================

// Endereço base da API que fornece os dados dos cursos e alunos
const API_URL = 'https://lion-school-phbo.onrender.com';

// Captura os elementos do HTML que serão manipulados pelo JavaScript
const app = document.getElementById('app');
const btnVoltar = document.getElementById('btnVoltar');
const btnSair = document.getElementById('btnSair');

// Armazena o curso selecionado pelo usuário
let cursoAtual = null;

// ==========================================
// FUNÇÕES DE API
// ==========================================

/**
 * Busca todos os cursos cadastrados na API.
 * Retorna um array de cursos em formato JSON.
 */
function getCursos() {
  return fetch(`${API_URL}/cursos`).then(res => res.json());
}

/**
 * Busca os alunos de um curso.
 * Também permite filtrar pelo status (cursando/finalizado).
 *
 * @param {number} cursoId - ID do curso selecionado.
 * @param {string} status - Status do aluno (opcional).
 */
function getAlunos(cursoId, status) {
  const params = new URLSearchParams();

  // Adiciona os parâmetros na URL apenas se existirem
  if (cursoId) params.append('curso_id', cursoId);
  if (status) params.append('status', status);

  return fetch(`${API_URL}/alunos?${params}`).then(res => res.json());
}

/**
 * Busca os dados completos de um aluno específico.
 *
 * @param {number} id - ID do aluno.
 */
function getAluno(id) {
  return fetch(`${API_URL}/alunos/${id}`).then(res => res.json());
}

/**
 * Define qual ícone será exibido para cada curso.
 * Verifica o ID ou a sigla do curso.
 *
 * @param {object} curso - Objeto recebido da API.
 */
function iconePorCurso(curso) {
  const texto = (curso.sigla || curso.nome || '').toUpperCase();

  if (curso.id === 1 || texto.includes('DS'))
    return 'icon-code.png';

  if (curso.id === 2 || texto.includes('RED'))
    return 'icon-network.png';

  // Ícone padrão caso não encontre nenhuma correspondência
  return 'icon-code.png';
}

/**
 * Escolhe automaticamente o avatar do aluno.
 * Caso a API não informe o sexo, utiliza o ID para alternar entre os avatares.
 *
 * @param {object} aluno - Dados do aluno.
 */
function avatarPorGenero(aluno) {

  if (aluno.sexo === 'F' || aluno.genero === 'feminino')
    return 'avatar-menina.png';

  if (aluno.sexo === 'M' || aluno.genero === 'masculino')
    return 'avatar-menino.png';

  // Caso não exista informação de sexo, alterna usando o ID
  return aluno.id % 2 === 0
    ? 'avatar-menina.png'
    : 'avatar-menino.png';
}

// ==========================================
// VIEW: HOME
// ==========================================

/**
 * Renderiza (monta) a tela inicial da aplicação.
 * Exibe todos os cursos disponíveis para seleção.
 */
function renderHome() {

  // Nenhum curso está selecionado
  cursoAtual = null;

  // Esconde o botão voltar
  btnVoltar.style.display = 'none';

  // Exibe o botão sair
  btnSair.style.display = 'inline-block';

  // Mensagem exibida enquanto a API responde
  app.innerHTML = `<p class="msg">Carregando cursos...</p>`;

  // Busca os cursos na API
  getCursos()

    .then(cursos => {

      // Cria toda a estrutura HTML da página inicial
      app.innerHTML = `
        <div class="home">
          <div class="home__content">
            <div class="home__texto">
              <h1>Escolha um <strong>curso</strong> para gerenciar</h1>
            </div>

            <!-- Os botões dos cursos serão adicionados aqui -->
            <div class="home__cursos" id="listaCursos"></div>
          </div>

          <div class="home__imagens">
            <img src="assets/ilustracao-aluna.png" alt="" class="home__ilustracao">
            <img src="assets/devices.png" alt="" class="home__devices">
          </div>
        </div>
      `;

      // Obtém a div onde serão inseridos os botões
      const listaCursos = document.getElementById('listaCursos');

      // Percorre todos os cursos recebidos da API
      cursos.forEach(curso => {

        // Cria um botão dinamicamente
        const btn = document.createElement('button');

        btn.className = 'curso-btn';

        // Define o ícone do curso
        const icone = iconePorCurso(curso);

        // Usa a sigla ou o nome do curso
        const sigla = curso.sigla || curso.nome;

        // Insere o conteúdo do botão
        btn.innerHTML = `
          <img src="assets/${icone}" alt="">
          <span>${sigla}</span>
        `;

        // Ao clicar no botão, abre a turma correspondente
        btn.addEventListener('click', () => renderTurma(curso.id));

        // Adiciona o botão na tela
        listaCursos.appendChild(btn);
      });

    })

    // Caso ocorra algum erro na requisição
    .catch(err => {

      console.error(err);

      app.innerHTML =
        `<p class="msg">Erro ao carregar cursos.</p>`;
    });
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

// Inicia a aplicação exibindo a tela Home
renderHome();
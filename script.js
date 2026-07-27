// ==========================================
// CONFIGURAÇÕES GLOBAIS
// ==========================================

// URL da API
const API_URL = 'https://lion-school-phbo.onrender.com';

// Elementos da página
const app = document.getElementById('app');
const btnVoltar = document.getElementById('btnVoltar');
const btnSair = document.getElementById('btnSair');

// Curso selecionado
let cursoAtual = null;

// Função chamada pelo botão voltar
let onVoltar = null;

// Executa a função definida para o botão voltar
btnVoltar.addEventListener('click', () => {
  if (typeof onVoltar === 'function') onVoltar();
});

// ==========================================
// FUNÇÕES DE API
// ==========================================

/**
 * Retorna a lista de cursos da API.
 */
function getCursos() {
  return fetch(`${API_URL}/cursos`).then(res => res.json());
}

/**
 * Retorna os alunos de um curso.
 *
 * @param {number} cursoId - ID do curso.
 * @param {string} status - Filtro de status.
 */
function getAlunos(cursoId, status) {
  const params = new URLSearchParams();

  // Adiciona os filtros na URL
  if (cursoId) params.append('curso_id', cursoId);
  if (status) params.append('status', status);

  return fetch(`${API_URL}/alunos?${params}`).then(res => res.json());
}

/**
 * Retorna um aluno pelo ID.
 *
 * @param {number} id - ID do aluno.
 */
function getAluno(id) {
  return fetch(`${API_URL}/alunos/${id}`).then(res => res.json());
}

/**
 * Define o ícone do curso.
 *
 * @param {object} curso - Dados do curso.
 */
function iconePorCurso(curso) {
  const texto = (curso.sigla || curso.nome || '').toUpperCase();

  if (curso.id === 1 || texto.includes('DS'))
    return 'icon-code.png';

  if (curso.id === 2 || texto.includes('RED'))
    return 'icon-network.png';

  // Ícone padrão
  return 'icon-code.png';
}

/**
 * Define o avatar do aluno.
 *
 * @param {object} aluno - Dados do aluno.
 */
function avatarPorGenero(aluno) {

  if (aluno.sexo === 'F' || aluno.genero === 'feminino')
    return 'avatar-menina.png';

  if (aluno.sexo === 'M' || aluno.genero === 'masculino')
    return 'avatar-menino.png';

  // Alterna o avatar caso a API não informe o sexo
  return aluno.id % 2 === 0
    ? 'avatar-menina.png'
    : 'avatar-menino.png';
}

// ==========================================
// VIEW: HOME
// ==========================================

/**
 * Exibe a tela inicial.
 */
function renderHome() {
 
  // Limpa o curso selecionado
  cursoAtual = null;
 
  // Esconde o botão voltar
  btnVoltar.style.display = 'none';
 
  // Mostra o botão sair
  btnSair.style.display = 'inline-block';

  // Não existe tela anterior
  onVoltar = null;
 
  // Mensagem de carregamento
  app.innerHTML = `<p class="msg">Carregando cursos...</p>`;
 
  // Busca os cursos
  getCursos()
 
    .then(cursos => {
 
      // Monta a tela inicial
      app.innerHTML = `
        <div class="home">
 
          <div class="home__coluna-esquerda">
            <div class="home__texto">
              <h1>Escolha um <strong>curso</strong> para gerenciar</h1>
            </div>
            <img src="assets/devices.png" alt="" class="home__devices">
          </div>
 
          <img src="assets/ilustracao-aluna.png" alt="" class="home__ilustracao">
 
          <!-- Os botões dos cursos serão adicionados aqui -->
          <div class="home__cursos" id="listaCursos"></div>
 
        </div>
      `;
 
      // Área onde os botões serão inseridos
      const listaCursos = document.getElementById('listaCursos');
 
      // Cria um botão para cada curso
      cursos.forEach(curso => {
 
        // Cria o botão
        const btn = document.createElement('button');
 
        btn.className = 'curso-btn';
 
        // Escolhe o ícone
        const icone = iconePorCurso(curso);
 
        // Nome exibido no botão
        const sigla = curso.sigla || curso.nome;
 
        // Conteúdo do botão
        btn.innerHTML = `
          <img src="assets/${icone}" alt="">
          <span>${sigla}</span>
        `;
 
        // Abre a turma do curso
        btn.addEventListener('click', () => renderTurma(curso));
 
        // Adiciona o botão na tela
        listaCursos.appendChild(btn);
      });
 
    })
    // Erro ao carregar os cursos
    .catch(err => {

      console.error(err);

      app.innerHTML =
        `<p class="msg">Erro ao carregar cursos.</p>`;
    });
}


// ==========================================
// VIEW: TURMA
// ==========================================

/**
 * Exibe a turma do curso.
 *
 * @param {object} curso - Curso selecionado.
 */
function renderTurma(curso) {

  // Salva o curso atual
  cursoAtual = curso;

  // Ajusta os botões da tela
  btnSair.style.display = 'none';
  btnVoltar.style.display = 'inline-block';

  // Volta para a Home
  onVoltar = renderHome;

  // Carrega todos os alunos
  carregarAlunos('todos');
}




// Inicia a aplicação
renderHome();
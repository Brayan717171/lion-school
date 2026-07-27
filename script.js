// ==========================================
// CONFIGURAÇÕES GLOBAIS
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

// Inicia a aplicação exibindo a tela Home
renderHome();
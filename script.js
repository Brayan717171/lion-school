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

/**
 * Carrega os alunos da turma.
 *
 * @param {string} status - Filtro de status.
 */
function carregarAlunos(status) {

  // Mensagem de carregamento
  app.innerHTML = `<p class="msg">Carregando alunos...</p>`;

  // Não envia filtro quando for "todos"
  const filtro = status === 'todos' ? undefined : status;

  getAlunos(cursoAtual.id, filtro)

    .then(alunos => {

      // Remove alunos duplicados que a API às vezes retorna repetidos
      const vistos = new Set();
      alunos = alunos.filter(aluno => {
        if (vistos.has(aluno.id)) return false;
        vistos.add(aluno.id);
        return true;
      });

      // Monta a tela da turma
      app.innerHTML = `
        <div class="turma-view">

          <div class="turma__toolbar">
            <select id="filtroStatus" class="turma__select">
              <option value="todos">Status</option>
              <option value="cursando">Cursando</option>
              <option value="finalizado">Finalizado</option>
            </select>

            <div class="legenda">
              <span class="legenda__label">LEGENDA</span>
              <span><span class="dot dot--cursando"></span> Cursando</span>
              <span><span class="dot dot--finalizado"></span> Finalizado</span>
            </div>
          </div>

          <div class="turma">
            <h2 class="turma__titulo">${cursoAtual.nome || cursoAtual.sigla}</h2>

            <div class="alunos-grid" id="alunosGrid"></div>
          </div>

        </div>
      `;

      // Atualiza o filtro selecionado
      document.getElementById('filtroStatus').value = status;

      // Recarrega ao trocar o filtro
      document.getElementById('filtroStatus')
        .addEventListener('change', (e) => carregarAlunos(e.target.value));

      // Área onde os cards serão adicionados
      const grid = document.getElementById('alunosGrid');

      // Cria um card para cada aluno
      alunos.forEach(aluno => {

        const finalizado = aluno.status === 'finalizado';

        // Cria o card
        const card = document.createElement('div');
        card.className = 'aluno-card' + (finalizado ? ' aluno-card--finalizado' : '');

        // Escolhe o avatar
        const avatar = avatarPorGenero(aluno);

        card.innerHTML = `
          <div class="aluno-card__foto">
             <img src="${aluno.foto || `assets/${avatarPorGenero(aluno)}`}" alt="">
          </div>
          <div class="aluno-card__nome">${aluno.nome}</div>
        `;

        // Abre os detalhes do aluno
        card.addEventListener('click', () => renderAluno(aluno.id));

        // Adiciona o card na tela
        grid.appendChild(card);
      });

    })

    // Erro ao carregar os alunos
    .catch(err => {

      console.error(err);

      app.innerHTML =
        `<p class="msg">Erro ao carregar alunos.</p>`;
    });
}

function renderAluno(id) {
  btnSair.style.display = 'none';
  btnVoltar.style.display = 'inline-block';
  btnVoltar.onclick = () => renderTurma(cursoAtual);
  
  app.innerHTML = `<p class="msg">Carregando detalhes do aluno...</p>`;
  
  getAluno(id)
    .then(aluno => {
      const nomeUpper = aluno.nome.toUpperCase();

      app.innerHTML = `
        <div class="aluno-detalhe">
          <div class="aluno-detalhe__info">
            <div class="aluno-detalhe__foto">
              <img src="${aluno.foto || `assets/${avatarPorGenero(aluno)}`}" alt="">
            </div>
            <div class="aluno-detalhe__nome">${nomeUpper}</div>
          </div>
          <div class="aluno-detalhe__grafico-wrapper">
            <div class="grafico" id="grafico"></div>
          </div>
        </div>
      `;
      montarGrafico(aluno.desempenho);
    })
    .catch(err => {
      console.error(err);
      app.innerHTML = `<p class="msg">Erro ao carregar detalhes do aluno.</p>`;
    });

}

/**
 * Monta o gráfico de barras de desempenho do aluno.
 *
 * @param {Array<{categoria: string, valor: number}>} desempenho - Lista de categorias e notas,
 *   ex: [{ categoria: "SGP", valor: 85 }, { categoria: "IP", valor: 92 }].
 */
function montarGrafico(desempenho) {
  const grafico = document.getElementById('grafico');

  if (!grafico || !Array.isArray(desempenho)) return;

  // Define a cor sólida e o brilho (glow) da barra conforme o valor
  function corPorValor(valor) {
    if (valor < 40) return { solida: '#c0392b', glow: 'rgba(192, 57, 43, 0.55)' };   // vermelho
    if (valor < 60) return { solida: '#e0b840', glow: 'rgba(224, 184, 64, 0.55)' };  // amarelo
    return { solida: '#2e3f8f', glow: 'rgba(46, 63, 143, 0.55)' };                   // azul
  }

  desempenho.forEach(({ categoria, valor }) => {
    const wrap = document.createElement('div');
    wrap.className = 'grafico__barra-wrap';

    const cor = corPorValor(valor);

    wrap.innerHTML = `
      <div class="grafico__valor" style="color:${cor.solida}">${valor}</div>
      <div class="grafico__barra-track">
        <div class="grafico__barra" style="height:${valor}%; background:${cor.solida}; box-shadow: 0 0 14px 2px ${cor.glow};"></div>
      </div>
      <div class="grafico__label" style="color:${cor.solida}">${categoria}</div>
    `;

    grafico.appendChild(wrap);
  });
}



// Inicia a aplicação
renderHome();
// ==========================================
// CONFIG
// ==========================================
const API_URL = 'https://lion-school-phbo.onrender.com';

const app = document.getElementById('app');
const btnVoltar = document.getElementById('btnVoltar');
const btnSair = document.getElementById('btnSair');

let cursoAtual = null;

// ==========================================
// FUNÇÕES DE API
// ==========================================

function getCursos() {
  return fetch(`${API_URL}/cursos`).then(res => res.json());
}

function getAlunos(cursoId, status) {
  const params = new URLSearchParams();
  if (cursoId) params.append('curso_id', cursoId);
  if (status) params.append('status', status);
  return fetch(`${API_URL}/alunos?${params}`).then(res => res.json());
}

function getAluno(id) {
  return fetch(`${API_URL}/alunos/${id}`).then(res => res.json());
}

function iconePorCurso(curso) {
  const texto = (curso.sigla || curso.nome || '').toUpperCase();
  if (curso.id === 1 || texto.includes('DS')) return 'icon-code.png';
  if (curso.id === 2 || texto.includes('RED')) return 'icon-network.png';
  return 'icon-code.png';
}

function avatarPorGenero(aluno) {
  if (aluno.sexo === 'F' || aluno.genero === 'feminino') return 'avatar-menina.png';
  if (aluno.sexo === 'M' || aluno.genero === 'masculino') return 'avatar-menino.png';
  return aluno.id % 2 === 0 ? 'avatar-menina.png' : 'avatar-menino.png';
}

// ==========================================
// VIEW: HOME
// ==========================================

function renderHome() {
  cursoAtual = null;
  btnVoltar.style.display = 'none';
  btnSair.style.display = 'inline-block';

  app.innerHTML = `<p class="msg">Carregando cursos...</p>`;

  getCursos()
    .then(cursos => {
      app.innerHTML = `
        <div class="home">
          <div class="home__content">
            <div class="home__texto">
              <h1>Escolha um <strong>curso</strong> para gerenciar</h1>
            </div>
            <div class="home__cursos" id="listaCursos"></div>
          </div>
          <div class="home__imagens">
            <img src="assets/ilustracao-aluna.png" alt="" class="home__ilustracao">
            <img src="assets/devices.png" alt="" class="home__devices">
          </div>
        </div>
      `;

      const listaCursos = document.getElementById('listaCursos');

      cursos.forEach(curso => {
        const btn = document.createElement('button');
        btn.className = 'curso-btn';
        const icone = iconePorCurso(curso);
        const sigla = curso.sigla || curso.nome;
        btn.innerHTML = `<img src="assets/${icone}" alt=""> <span>${sigla}</span>`;
        btn.addEventListener('click', () => renderTurma(curso.id));
        listaCursos.appendChild(btn);
      });
    })
    .catch(err => {
      console.error(err);
      app.innerHTML = `<p class="msg">Erro ao carregar cursos.</p>`;
    });
}




// ==========================================
// INICIALIZAÇÃO
// ==========================================

renderHome();
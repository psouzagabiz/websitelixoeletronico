const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORTA = process.env.PORT || 3000;
const CODIGO_CONVITE_ADMIN = process.env.ADMIN_INVITE_CODE || 'posse2026';

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'descarte-certo-posse-troque-esse-segredo',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 4 } // 4 horas
}));

// Deixa o usuário logado (se houver) disponível em todas as views.
app.use((req, res, next) => {
  res.locals.usuarioLogado = req.session.usuario || null;
  next();
});

function exigirLogin(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  next();
}

// ---------- Páginas públicas ----------

app.get('/', (req, res) => {
  const pontos = db.prepare('SELECT * FROM pontos ORDER BY nome').all();
  res.render('index', { pagina: 'inicio', pontos });
});

app.get('/sobre', (req, res) => {
  res.render('sobre', { pagina: 'sobre' });
});

app.get('/dicas', (req, res) => {
  res.render('dicas', { pagina: 'dicas' });
});

app.get('/contato', (req, res) => {
  res.render('contato', { pagina: 'contato' });
});

// ---------- Login e cadastro de administrador ----------

app.get('/login', (req, res) => {
  res.render('login', { pagina: 'login', erro: null });
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);

  if (!usuario || !bcrypt.compareSync(senha, usuario.senha_hash)) {
    return res.render('login', { pagina: 'login', erro: 'E-mail ou senha incorretos.' });
  }

  req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email };
  res.redirect('/admin');
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro', { pagina: 'cadastro', erro: null });
});

app.post('/cadastro', (req, res) => {
  const { nome, email, senha, codigoConvite } = req.body;

  if (codigoConvite !== CODIGO_CONVITE_ADMIN) {
    return res.render('cadastro', { pagina: 'cadastro', erro: 'Código de convite inválido.' });
  }

  const jaExiste = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (jaExiste) {
    return res.render('cadastro', { pagina: 'cadastro', erro: 'Já existe uma conta com esse e-mail.' });
  }

  const senhaHash = bcrypt.hashSync(senha, 10);
  db.prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)').run(nome, email, senhaHash);

  res.redirect('/login');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// ---------- Área do administrador ----------

app.get('/admin', exigirLogin, (req, res) => {
  const pontos = db.prepare('SELECT * FROM pontos ORDER BY id DESC').all();
  res.render('admin', { pagina: 'admin', pontos });
});

app.post('/admin/pontos', exigirLogin, (req, res) => {
  const { nome, tipo, endereco, recebe, lat, lng } = req.body;
  db.prepare(`
    INSERT INTO pontos (nome, tipo, endereco, recebe, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(nome, tipo, endereco, recebe, parseFloat(lat), parseFloat(lng));

  res.redirect('/admin');
});

app.post('/admin/pontos/:id/excluir', exigirLogin, (req, res) => {
  db.prepare('DELETE FROM pontos WHERE id = ?').run(req.params.id);
  res.redirect('/admin');
});

app.listen(PORTA, () => {
  console.log(`Descarte Certo Posse rodando em http://localhost:${PORTA}`);
});
